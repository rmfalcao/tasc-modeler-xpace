# TASC Modeler

The Task-specific Context Modeler (TASC  Modeler) is a context model generator that creates context models to support the elicitation of context-aware functionalities. It uses TASC4RE as language to represent context models.

## Configuring a contextual data processor

TASC Modeler is responsible for creating the graphical representation of the context model. It depends on a contextual data processor, which can be set in the configuration file `processor-settings.json`. By default TASC Modeler is configured to used xPACE as contextual data processor.

## Getting started

The best way to build and run TASC Modeler is using Docker:

```
docker build -t tasc-modeler-image .
docker run -p 3000:3000 tasc-modeler-image
```

Then you can access the application at `http://localhost:3000`. Note that the configured contextual data processor must be active.

# xPACE

The eXtended Pairwise Analysis of Contextual Elements (xPACE) is a contextual data processor that analyzes contextual data to identify contexts that influence a user task of interest.

## Getting started

The best way to build and run xPACE is using Docker:

```
docker build -t xpace-image .
docker run -p 8080:8080 xpace-image
```
