package com.ljkhyeong.portfolio.knowledge.config;

import co.elastic.clients.transport.rest5_client.low_level.Rest5ClientBuilder;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.async.HttpAsyncClientBuilder;
import org.apache.hc.core5.util.Timeout;
import org.springframework.boot.elasticsearch.autoconfigure.ElasticsearchProperties;
import org.springframework.boot.elasticsearch.autoconfigure.Rest5ClientBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ElasticsearchConfiguration {

    @Bean
    Rest5ClientBuilderCustomizer elasticsearchRequestLimitCustomizer(ElasticsearchProperties properties) {
        return new Rest5ClientBuilderCustomizer() {

            @Override
            public void customize(Rest5ClientBuilder builder) {
            }

            @Override
            public void customize(HttpAsyncClientBuilder httpClientBuilder) {
                httpClientBuilder.disableRedirectHandling();
            }

            // Rest5Client 기본 응답 대기 시간(0, 무제한)이 요청 중 socket-timeout을 덮어쓰므로 같은 값으로 제한한다.
            @Override
            public void customize(RequestConfig.Builder requestConfigBuilder) {
                requestConfigBuilder.setResponseTimeout(Timeout.of(properties.getSocketTimeout()));
            }
        };
    }
}
