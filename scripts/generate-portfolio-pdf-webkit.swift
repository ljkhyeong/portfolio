import AppKit
import Foundation
import WebKit

final class PortfolioPdfGenerator: NSObject, WKNavigationDelegate {
    private let printUrl: URL
    private let outputUrl: URL
    private let timeout: TimeInterval = 12
    private var deadline: Date?
    private var printOperation: NSPrintOperation?
    private var window: NSWindow?
    private var webView: WKWebView?

    init(printUrl: URL, outputUrl: URL) {
        self.printUrl = printUrl
        self.outputUrl = outputUrl
    }

    func start() {
        let configuration = WKWebViewConfiguration()
        configuration.preferences.shouldPrintBackgrounds = true

        let webView = WKWebView(
            frame: NSRect(x: 0, y: 0, width: 1440, height: 900),
            configuration: configuration
        )
        webView.navigationDelegate = self
        webView.mediaType = "print"

        let window = NSWindow(
            contentRect: webView.frame,
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )
        window.contentView = webView
        window.isReleasedWhenClosed = false
        window.setFrameOrigin(NSPoint(x: -10_000, y: -10_000))
        window.orderFrontRegardless()

        self.webView = webView
        self.window = window
        self.deadline = Date().addingTimeInterval(timeout)

        webView.load(URLRequest(url: printUrl))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        waitForPrintReadiness()
    }

    func webView(
        _ webView: WKWebView,
        didFail navigation: WKNavigation!,
        withError error: Error
    ) {
        fail("WebKit이 인쇄 페이지를 불러오지 못했습니다: \(error.localizedDescription)")
    }

    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation!,
        withError error: Error
    ) {
        fail("WebKit이 인쇄 페이지에 연결하지 못했습니다: \(error.localizedDescription)")
    }

    private func waitForPrintReadiness() {
        guard let webView else {
            fail("WebKit 인쇄 화면을 찾지 못했습니다.")
            return
        }

        let script = """
        JSON.stringify({
            state: document.documentElement.dataset.printReady || "loading",
            overflowCount: Number(document.documentElement.dataset.printOverflowCount || -1),
            overflowPages: document.documentElement.dataset.printOverflowPages || "확인 불가",
            error: document.documentElement.dataset.printError || ""
        })
        """

        webView.evaluateJavaScript(script) { [weak self] result, error in
            guard let self else { return }

            if let error {
                self.fail("WebKit 인쇄 화면 검증에 실패했습니다: \(error.localizedDescription)")
                return
            }

            guard
                let json = result as? String,
                let data = json.data(using: .utf8),
                let readiness = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                let state = readiness["state"] as? String
            else {
                self.fail("WebKit 인쇄 화면의 준비 상태를 확인하지 못했습니다.")
                return
            }

            if state == "true" {
                let overflowCount = readiness["overflowCount"] as? Int ?? -1
                let overflowPages = readiness["overflowPages"] as? String ?? "확인 불가"

                if overflowCount != 0 {
                    self.fail("인쇄 원본에서 가로 영역을 벗어난 요소가 있습니다: \(overflowPages)")
                    return
                }

                self.savePdf()
                return
            }

            if state == "error" {
                let message = readiness["error"] as? String ?? "원인을 확인할 수 없습니다."
                self.fail("WebKit 인쇄 화면 준비에 실패했습니다: \(message)")
                return
            }

            if Date() >= self.deadline ?? Date() {
                self.fail("WebKit 인쇄 화면의 이미지와 폰트 준비 시간이 초과됐습니다.")
                return
            }

            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                self.waitForPrintReadiness()
            }
        }
    }

    private func savePdf() {
        guard let webView, let window else {
            fail("WebKit 인쇄 화면을 찾지 못했습니다.")
            return
        }

        guard let printInfo = NSPrintInfo.shared.copy() as? NSPrintInfo else {
            fail("WebKit 인쇄 설정을 만들지 못했습니다.")
            return
        }

        printInfo.paperSize = NSSize(width: 595.28, height: 841.89)
        printInfo.topMargin = 0
        printInfo.bottomMargin = 0
        printInfo.leftMargin = 0
        printInfo.rightMargin = 0
        printInfo.jobDisposition = .save
        printInfo.dictionary()[NSPrintInfo.AttributeKey.jobSavingURL] = outputUrl as NSURL
        printInfo.dictionary()[NSPrintInfo.AttributeKey.headerAndFooter] = false

        let operation = webView.printOperation(with: printInfo)
        operation.showsPrintPanel = false
        operation.showsProgressPanel = false
        printOperation = operation

        DispatchQueue.main.asyncAfter(deadline: .now() + 30) { [weak self] in
            guard let self, self.printOperation != nil else { return }
            self.fail("WebKit PDF 생성 시간이 초과됐습니다.")
        }

        operation.runModal(
            for: window,
            delegate: self,
            didRun: #selector(printOperationDidRun(_:success:contextInfo:)),
            contextInfo: nil
        )
    }

    @objc private func printOperationDidRun(
        _ operation: NSPrintOperation,
        success: Bool,
        contextInfo: UnsafeMutableRawPointer?
    ) {
        printOperation = nil

        guard success else {
            fail("WebKit이 PDF 파일을 저장하지 못했습니다.")
            return
        }

        print("WebKit PDF 저장 완료: \(outputUrl.path)")
        exit(EXIT_SUCCESS)
    }

    private func fail(_ message: String) {
        FileHandle.standardError.write(Data("\(message)\n".utf8))
        exit(EXIT_FAILURE)
    }
}

guard CommandLine.arguments.count == 3 else {
    FileHandle.standardError.write(
        Data("사용법: generate-portfolio-pdf-webkit.swift <인쇄 URL> <출력 PDF>\n".utf8)
    )
    exit(EXIT_FAILURE)
}

guard let printUrl = URL(string: CommandLine.arguments[1]) else {
    FileHandle.standardError.write(Data("올바른 인쇄 URL을 입력해 주세요.\n".utf8))
    exit(EXIT_FAILURE)
}

let outputUrl = URL(fileURLWithPath: CommandLine.arguments[2])
let application = NSApplication.shared
application.setActivationPolicy(.prohibited)

let generator = PortfolioPdfGenerator(printUrl: printUrl, outputUrl: outputUrl)
generator.start()
application.run()
