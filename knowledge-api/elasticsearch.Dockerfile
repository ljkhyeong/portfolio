FROM docker.elastic.co/elasticsearch/elasticsearch:9.4.8
RUN bin/elasticsearch-plugin install --batch analysis-nori
