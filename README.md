![TASC Modeler and xPACE logos](tasc-modeler-xpace.svg)

# TASC Modeler

The Task-specific Context Modeler (TASC  Modeler) is a context model generator that creates context models to support the elicitation of context-aware functionalities. It uses TASC4RE as language to represent context models.

## Configuring a contextual data processor

TASC Modeler is responsible for creating the graphical representation of the context model. It depends on a contextual data processor, which can be set in the configuration file `processor-settings.json`. By default TASC Modeler is configured to used xPACE as contextual data processor.

## Getting started

The best way to build and run TASC Modeler is using Docker. The Docker container for starting TASC Modeler requires approx. 600 MB of RAM.

```
docker build -t tasc-modeler-image .
docker run -p 3000:3000 tasc-modeler-image
```

---
**NOTE**

If you are running Docker Desktop on Windows, you might need to active WSL 2 integration and use the following command to build the image:

```
DOCKER_BUILDKIT=0 docker build -t tasc-modeler-image .
```
---

You can access the application at `http://localhost:3000`. Note that the configured contextual data processor must be active.

# xPACE

The eXtended Pairwise Analysis of Contextual Elements (xPACE) is a contextual data processor that analyzes contextual data to identify contexts that influence a user task of interest.

## Getting started

The best way to build and run xPACE is using Docker. The Docker container for starting xPACE requires approx. 300 MB of RAM - note that more memory may be needed depending on the dataset size.

```
docker build -t xpace-image .
docker run -p 8080:8080 xpace-image
```

---
**NOTE**

If you are running Docker Desktop on Windows, you might need to active WSL 2 integration and use the following command to build the image:

```
DOCKER_BUILDKIT=0 docker build -t xpace-image .
```
---

# Preparing the input data

TASC Modeler and xPACE requires three input data in order to be able to trigger the data processing and generate the context model.

- Task name: a simple text describing the name of the user task of interest. This text is used to name the user task in the context model to be generated. Example: "Create a comment".
- Dataset: a CSV file containing the values of the contextual elements when the user task of interest was performed. The first line is a header. The column names correspond to the IDs of the contextual elements.
- Metadata: a CSV file describing characteristics of the contextual elements included in the dataset. The metadata file has 1 line for the header + N lines, where N corresponds to the number of contextual elements included in the dataset. The columns of the metadata file are described in the table below:

| Attribute            | Description                                                                                                    | Type    | Values                                                     | Mandatory |
|----------------------|----------------------------------------------------------------------------------------------------------------|---------|------------------------------------------------------------|-----------|
| id                   | ID of the contextual element                                                                                   | String  | n/a                                                        |    yes    |
| variable type        | Type of the contextual element                                                                                 | String  | "CATE"<br>(for categorical),<br>"CONT"<br>(for continuous) |    yes    |
| is_always_analyzed   | Whether the contextual element should always be analyzed<br>by xPACE                                           | Boolean | true, false                                                |    yes    |
| is_intrinsic         | Whether the contextual element characterizes an intrinsic<br>aspect of the object entity                       | Boolean | true, false                                                |    yes    |
| minimize             | Whether xPACE should try to minimize the value of the<br>contextual element. Only for continuous variables     | Boolean | true, false                                                |     no    |
| maximize             | Whether xPACE should try to maximize the value of the<br>contextual element. Only for continuous variables     | Boolean | true, false                                                |     no    |
| template_description | Template for the description of a context instance of the<br>contextual element                                | String  | n/a                                                        |    yes    |
| subtemplate_negative | For increasing the expressiveness of the description of<br>continuous variables when their values are negative | String  | n/a                                                        |     no    |
| subtemplate_positive | For increasing the expressiveness of the description of<br>continuous variables when their values are positive | String  | n/a                                                        |     no    |
| value_formatter      | Name of the xPACE formatting function that has to be<br>used to format the value of the contextual element     | String  | n/a                                                        |     no    |
