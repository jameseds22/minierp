# ---------- ETAPA 1: BUILD ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar todo el proyecto
COPY . .

# Construir el jar
RUN mvn clean package -DskipTests


# ---------- ETAPA 2: RUN ----------
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copiar el jar desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]