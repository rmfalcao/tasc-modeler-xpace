package de.fraunhofer.iese.xpace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class RService {

    @Value("${file.upload-dir:/app/R-dependency}")
    private String pathShell;

    public String processR(MultipartFile metadata, MultipartFile dataset, String taskDescription) throws Exception{

        String metadataFileName = this.saveFileOnStorage(metadata);
        String datasetFileName = this.saveFileOnStorage(dataset);

        String[] command = {"sh", "r.sh", datasetFileName, metadataFileName, taskDescription};
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(new File(pathShell));
        Process p = pb.start();
        p.waitFor();
        Path path = Paths.get(pathShell+"/contexts.json");
        //teste
        return new String(Files.readAllBytes(path));
    }

    private String saveFileOnStorage(MultipartFile multipartFile) throws IOException {
        String multipartFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        Path multipartLocation = Path.of(pathShell).resolve(multipartFileName);

        Files.copy(multipartFile.getInputStream(), multipartLocation, StandardCopyOption.REPLACE_EXISTING);

        return multipartFileName;
    }
}
