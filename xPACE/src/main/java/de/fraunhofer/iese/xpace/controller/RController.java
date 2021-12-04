package de.fraunhofer.iese.xpace.controller;

import de.fraunhofer.iese.xpace.service.RService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class RController {

    @Autowired
    private RService rService;

    @PostMapping(value = "/contexts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> post(
            @RequestParam("metadata") MultipartFile metadata,
            @RequestParam("dataset") MultipartFile dataset,
            @RequestParam("taskDescription") String taskDescription
    ) throws Exception {
        return ResponseEntity.ok(rService.processR(metadata, dataset, taskDescription));
    }
}
