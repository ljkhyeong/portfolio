import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "../../css/BatonServiceSwitcher.css"

const BatonServiceSwitcher = ({ services, currentServiceId = "core" }) => {
    const serviceListRef = useRef(null)

    useEffect(() => {
        const serviceList = serviceListRef.current

        if (!serviceList) {
            return undefined
        }

        const revealCurrentService = () => {
            const currentLink = serviceList.querySelector('[aria-current="page"]')

            if (
                !currentLink ||
                serviceList.scrollWidth <= serviceList.clientWidth ||
                typeof serviceList.scrollTo !== "function"
            ) {
                return
            }

            const centeredPosition =
                currentLink.offsetLeft - (serviceList.clientWidth - currentLink.offsetWidth) / 2

            serviceList.scrollTo({
                left: Math.max(0, centeredPosition),
                behavior: "auto",
            })
        }

        revealCurrentService()
        window.addEventListener("resize", revealCurrentService)

        return () => window.removeEventListener("resize", revealCurrentService)
    }, [currentServiceId, services])

    return (
        <nav className="baton-service-switcher" aria-label="BATON 서비스 바로가기">
            <span>BATON 서비스</span>
            <ul ref={serviceListRef}>
                {services.map((service) => {
                    const serviceId = service.primary ? "core" : service.id
                    const isCurrent = serviceId === currentServiceId

                    return (
                        <li key={serviceId}>
                            <Link
                                to={service.primary ? "/projects/baton" : service.route}
                                aria-current={isCurrent ? "page" : undefined}
                            >
                                {service.primary ? "Core" : service.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default BatonServiceSwitcher
