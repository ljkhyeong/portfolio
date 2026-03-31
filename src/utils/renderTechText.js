const TECH_TOKENS = [
  "Spring Security",
  "Hexagonal Architecture",
  "GitHub Actions",
  "Argo CD",
  "React Router",
  "TanStack Query",
  "Spring Session",
  "Spring Boot",
  "Spring Interceptor",
  "JSR-303 Validator",
  "Apache Tika",
  "React 19",
  "Multi-module",
  "Testcontainers",
  "Playwright",
  "Prometheus",
  "Grafana",
  "Actuator",
  "Resilience4j",
  "TypeScript",
  "JavaScript",
  "WebSquare",
  "Thymeleaf",
  "Hibernate",
  "Validator",
  "WebSocket",
  "WebRTC",
  "mediasoup-client",
  "video.js",
  "FFmpeg",
  "GStreamer",
  "Node.js",
  "MyBatis",
  "MariaDB",
  "Spring",
  "Flyway",
  "Redis",
  "MySQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "XML",
  "Java",
  "JPA",
  "Vite",
  "React",
  "HLS",
  "eGov",
  "JEUS",
  "Tibero",
  "SVN",
  "Jenkins",
  "Nexus",
  "OAuth",
  "Git",
  "Notion",
  "Sentry",
  "Bootstrap",
];

const tokenSet = new Set(TECH_TOKENS);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const techPattern = new RegExp(
  `(${[...TECH_TOKENS].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
  "g",
);

export const renderTechText = (text) => {
  if (typeof text !== "string") {
    return text;
  }

  return text
    .split(techPattern)
    .filter(Boolean)
    .map((part, index) => {
      if (tokenSet.has(part)) {
        return <code key={index}>{part}</code>;
      }

      return part;
    });
};
