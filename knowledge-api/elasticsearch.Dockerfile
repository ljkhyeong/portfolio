FROM docker.elastic.co/elasticsearch/elasticsearch:8.19.20
RUN bin/elasticsearch-plugin install --batch analysis-nori
