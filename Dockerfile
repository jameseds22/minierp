# Imagen oficial moderna de Java
FROM eclipse-temurin:17-jdk-jammy

# Carpeta de trabajo
WORKDIR /app

# Copiar el jar
COPY target/*.jar app.jar

# Puerto
EXPOSE 8080

# Ejecutar
ENTRYPOINT ["java","-jar","app.jar"]