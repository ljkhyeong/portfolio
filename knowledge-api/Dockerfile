FROM eclipse-temurin:21-jdk AS builder

WORKDIR /workspace

COPY knowledge-api/gradlew knowledge-api/gradlew
COPY knowledge-api/gradle knowledge-api/gradle
COPY knowledge-api/settings.gradle knowledge-api/build.gradle knowledge-api/
COPY knowledge-api/src knowledge-api/src
COPY public/knowledge/portfolio.json public/knowledge/portfolio.json

WORKDIR /workspace/knowledge-api
RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=builder /workspace/knowledge-api/build/libs/portfolio-knowledge-api-0.1.0.jar app.jar

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

USER 10001
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
