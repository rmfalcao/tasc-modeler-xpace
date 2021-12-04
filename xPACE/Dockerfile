FROM adoptopenjdk/maven-openjdk11 AS build

WORKDIR /app
COPY src /app/src
COPY pom.xml /app/pom.xml
RUN  mvn -f /app/pom.xml clean package -DskipTests
RUN cp /app/target/xpace-0.1.jar /app/app.jar

FROM rocker/r-base

WORKDIR /app

RUN mkdir /app/R-dependency/

COPY R-dependency/* /app/R-dependency/

RUN ls -la /app/R-dependency/

WORKDIR /app/R-dependency/
  
RUN sh /app/R-dependency/load_lib_r.sh

RUN apt update -y && apt install -y openjdk-11-jdk

COPY --from=build /app/app.jar .

ARG JAVA_OPTS=""
ARG JAVA_SERVER_OPTS="-server -XX:+UseParallelGC -XX:ParallelGCThreads=100 -XX:MaxGCPauseMillis=5 -XX:GCTimeRatio=10 -Xms512m -Xmx1024m"

ENV JAVA_OPTS=${JAVA_OPTS}
ENV JAVA_SERVER_OPTS=${JAVA_SERVER_OPTS}

ENTRYPOINT java ${JAVA_OPTS} ${JAVA_SERVER_OPTS} -jar app.jar

