#!/usr/bin/env Rscript

#####################################
#
# Script for analysis of relevant combinations of CE's
#
# Input:
#       - contextual dataset (CSV)
#       - metadata (CSV)
#       - task name (string)
#
#   Optional configuration parameters include: 
#       "threshold_cramerv"
#       "threshold_pvalue_chi2"
#       "threshold_pvalue_kruskal_wallis"
#       "threshold_pvalue_conover"
#
# Output: standardized task-specific contexts file (JSON format)
#
#
#####################################


Sys.setenv(LANGUAGE="en")


#########################################

DEBUG_MODE <- FALSE


# loading libraries

source("load_libraries.R")


# Defining useful functions:

source("util.R")


  args <- commandArgs(asValues =  TRUE, trailingOnly = TRUE)
  #str(args)
  
  if (!isTRUE(DEBUG_MODE)) {
    stopifnot(args$args)
  }
  
  
  if (is.null(args$threshold_cramerv)) {
    args$threshold_cramerv <- 0.3
  } else {
    args$threshold_cramerv <- as.numeric(args$threshold_cramerv)
  }
  
  if (is.null(args$threshold_pvalue_chi2)) {
    args$threshold_pvalue_chi2 <- 0.05
  } else {
    args$threshold_pvalue_chi2 <- as.numeric(args$threshold_pvalue_chi2)
  }
  
  if (is.null(args$threshold_pvalue_kruskal_wallis)) {
    args$threshold_pvalue_kruskal_wallis <- 0.001
  } else {
    args$threshold_pvalue_kruskal_wallis <- as.numeric(args$threshold_pvalue_kruskal_wallis)
  }
  
  if (is.null(args$threshold_pvalue_conover)) {
    args$threshold_pvalue_conover <- 0.05
  } else {
    args$threshold_pvalue_conover <- as.numeric(args$threshold_pvalue_conover)
  }
  
  input_parameters <- c(args$threshold_cramerv , args$threshold_pvalue_chi2, args$threshold_pvalue_kruskal_wallis, args$threshold_pvalue_conover)
  names(input_parameters) <- c("threshold_cramerv","threshold_pvalue_chi2", "threshold_pvalue_kruskal_wallis", "threshold_pvalue_conover")
  

  if (isTRUE(DEBUG_MODE)) {
    source("load_data_hardcoded.R")
  } else {
    source("load_data.R")
  }
  
  

  preparedDataset <- ds
  

 

# looping

columns <- colnames(preparedDataset)

columnsInCombination <- combinations(length(columns),2,columns)

listJSONobjects <- list()



for (line in 1:nrow(columnsInCombination)) {
  

  isXTarget <- is_always_analyzed(columnsInCombination[line,1], metadata)
  
  isYTarget <- is_always_analyzed(columnsInCombination[line,2], metadata)
  
  

  type_x <- get_type_of_variable(columnsInCombination[line,1], metadata)
  type_y <- get_type_of_variable(columnsInCombination[line,2], metadata)

  
  
  x = preparedDataset[,columnsInCombination[line,1]]
  y = preparedDataset[,columnsInCombination[line,2]]


  if (isTRUE(isXTarget) || isTRUE(isYTarget)) {
  # at least one variable is a target variable

    if (type_x == "CATE" && type_y == "CATE") {
    #####
    # CATE-CATE
    #####

      contingenceAbsolute <- table(x, y, useNA = c("no"))

      cramer_test_value <- CramerV(contingenceAbsolute, bias.correct = TRUE)
      chi2_test <- chisq.test(contingenceAbsolute)
      
      if (!is.nan(cramer_test_value) && cramer_test_value >= input_parameters["threshold_cramerv"] && chi2_test$p.value < input_parameters["threshold_pvalue_chi2"]) {
        
        # analyze standard residuals
        #
        #
        
        x_predicts_y <- UncertCoef(x, y, direction = "column") # y (author) gives info about x (content type) (the higher, the better)
        y_predicts_x <- UncertCoef(y, x, direction = "column")
        
        if (x_predicts_y > y_predicts_x) {
          y_is_target <- TRUE
        } else {
          y_is_target <- FALSE
        }
        
        
        tab_residuals <- chisq.residuals(contingenceAbsolute, digits = 2, std = TRUE, raw = FALSE)
        

        for (i in 1:dim(tab_residuals)[1]) {
          for (j in 1:dim(tab_residuals)[2]) {

            if (tab_residuals[i,j] > 2) {

              
              function_formatter_CATE_name_1 <- get_value_formatter(columnsInCombination[line,1], metadata)
              
              if (!is.na(function_formatter_CATE_name_1) && !is.null(function_formatter_CATE_name_1) && function_formatter_CATE_name_1 != "") {
                function_formatter_CATE_1 <- get(function_formatter_CATE_name_1)
              } else {
                function_formatter_CATE_1 <- identity
              }
              
              function_formatter_CATE_name_2 <- get_value_formatter(columnsInCombination[line,2], metadata)
              
              if (!is.na(function_formatter_CATE_name_2) && !is.null(function_formatter_CATE_name_2) && function_formatter_CATE_name_2 != "") {
                function_formatter_CATE_2 <- get(function_formatter_CATE_name_2)
              } else {
                function_formatter_CATE_2 <- identity
              }
              
              
              if (y_is_target) {
                origin_ce <- paste0("{\"contextual_element_id\":\"", columnsInCombination[line,2], "\", \"value\":\"", format_template_CATE(get_template_description(columnsInCombination[line,2], metadata),function_formatter_CATE_2, names(tab_residuals[i,])[j]), "\"}")
                target_ce <- paste0("{\"contextual_element_id\":\"", columnsInCombination[line,1], "\", \"value\":\"", format_template_CATE(get_template_description(columnsInCombination[line,1], metadata),function_formatter_CATE_1, names(tab_residuals[,j])[i]), "\"}")
              } else {
                target_ce <- paste0("{\"contextual_element_id\":\"", columnsInCombination[line,2], "\", \"value\":\"", format_template_CATE(get_template_description(columnsInCombination[line,2], metadata),function_formatter_CATE_2, names(tab_residuals[i,])[j]), "\"}")
                origin_ce <- paste0("{\"contextual_element_id\":\"", columnsInCombination[line,1], "\", \"value\":\"", format_template_CATE(get_template_description(columnsInCombination[line,1], metadata),function_formatter_CATE_1, names(tab_residuals[,j])[i]), "\"}")
              }
              
              


              jsonText <- paste0("[",origin_ce,",",target_ce,"]")
              

              listJSONobjects[[length(listJSONobjects)+1]] <- fromJSON(jsonText)              
              
            } 
            
          }
          
        }
        
        
       
        
        
        
        
        
        
        
      }
      
      
    } else if ((type_x == "CATE" && type_y == "CONT") || (type_x == "CONT" && type_y == "CATE")) {
      ######
      # CATE-CONT
      ######
      
      

        
      
      check <- tryCatch({
        

        if (type_x == "CATE") {

          variableCONTName <- columnsInCombination[line,2]
          variableCATEName <- columnsInCombination[line,1]
        
          
          test_kruskalw <- kruskal.test(y~x, data=preparedDataset)

        } else {

          variableCONTName <- columnsInCombination[line,1]
          variableCATEName <- columnsInCombination[line,2]
          
          test_kruskalw <- kruskal.test(x~y, data=preparedDataset)
        }
        

        if (test_kruskalw$p.value < input_parameters["threshold_pvalue_kruskal_wallis"]) {
          
          

          obj_conover <- ConoverTest(abs(preparedDataset[,variableCONTName]), preparedDataset[,variableCATEName])

          
          list_of_cate_instances_associated_with_cont_rank_mean <- list() # empty list
          

            # AT THIS POINT, "categories" HAS ALL INSTANCES THAT HAD RELEVANT RESULTS (CONOVER P-VALUE)
            # IF NO FLAG IS USED, THIS IS THE FINAL LIST (we only need to remove duplicates).
              
            use_minimal_strategy <- use_minimal_variable(variableCONTName, metadata)
            use_maximal_strategy <- use_maximal_variable(variableCONTName, metadata)
            
            
            
            categories <- list()
            
            if (isTRUE(use_minimal_strategy) || isTRUE(use_maximal_strategy)) {
             
              # create list of MAX

              category_instances_min <- list()
              category_instances_max <- list()
              
              for (l in 1:nrow(obj_conover[[1]])) {
                
                if (obj_conover[[1]][l,2] < input_parameters["threshold_pvalue_conover"]) {
                  if (nrow(obj_conover[[1]]) == 1) {

                    
                    categories_max_min <- c(levels(preparedDataset[,variableCATEName])[2], levels(preparedDataset[,variableCATEName])[1])

                    
                  } else {
                    
                    categories_max_min <- strsplit(names(obj_conover[[1]][,1][l]), "-")[[1]]
                    
                  }
                  
                  
                  
                  if (obj_conover[[1]][l,1] > 0) {
                    category_instances_max[length(category_instances_max)+1] <- categories_max_min[1]
                    category_instances_min[length(category_instances_min)+1] <- categories_max_min[2]
                    
                  } else {
                    category_instances_max[length(category_instances_max)+1] <- categories_max_min[2]
                    category_instances_min[length(category_instances_min)+1] <- categories_max_min[1]
                    
                  }
              
                }
              }
              
              category_instances_min <- unique(category_instances_min)
              category_instances_max <- unique(category_instances_max)
              

              categories_min_not_max <- list()
              categories_max_not_min <- list()
              
              if (use_minimal_strategy) {
                categories_min_not_max <- setdiff(category_instances_min, category_instances_max)

              }
              
              if (use_maximal_strategy) {
                categories_max_not_min <- setdiff(category_instances_max, category_instances_min)

                
              }
              
              categories <- unique(c(categories_min_not_max, categories_max_not_min))

              

            } else {
              
            # neither max or min strategy. Take all.
              for (k in 1:nrow(obj_conover[[1]])) {
                
                if (obj_conover[[1]][k,2] < input_parameters["threshold_pvalue_conover"]) {

                  if (nrow(obj_conover[[1]]) == 1) {

                    
                    categories_all <- c(levels(preparedDataset[,variableCATEName])[2], levels(preparedDataset[,variableCATEName])[1])

                    
                  } else {
                    
                    
                    categories_all <- strsplit(names(obj_conover[[1]][,1][k]), "-")[[1]]
                    
                  }
                  
                  categories[length(categories)+1] <- categories_all[1]
                  categories[length(categories)+1] <- categories_all[2]  
                  
                }
              
                
              }
              

              categories <- unique(categories)
          }
          
          
            
          #### here CATEGORIES has everything that is needed. 
            
            

          list_of_cate_instances_associated_with_cont_rank_mean <- categories
          
          for (m in 1:length(list_of_cate_instances_associated_with_cont_rank_mean)) {
            

            resultCONTperCATE <- preparedDataset[preparedDataset[,variableCATEName] == list_of_cate_instances_associated_with_cont_rank_mean[[m]],]
            summaryCONTperCATE <- summary(resultCONTperCATE[,variableCONTName])
            
            
            #summaryCONTperCATE
            # 1st - 2nd quartile
            minCONT <- summaryCONTperCATE[1]
            maxCONT <- summaryCONTperCATE[2]
            

            
            diff <- maxCONT - minCONT
            
            # 2nd quartile - median
            
            
            
            
            if ((summaryCONTperCATE[3]-summaryCONTperCATE[2]) < diff) {
              diff <- summaryCONTperCATE[3]-summaryCONTperCATE[2]
              
              minCONT <- summaryCONTperCATE[2]
              maxCONT <- summaryCONTperCATE[3]
            }
            
            # median - 3rd quartile
            if ((summaryCONTperCATE[5]-summaryCONTperCATE[3]) < diff) {
              diff <- summaryCONTperCATE[5]-summaryCONTperCATE[3]
              
              minCONT <- summaryCONTperCATE[3]
              maxCONT <- summaryCONTperCATE[5]
            }
            
            # median - 3rd quartile
            if ((summaryCONTperCATE[6]-summaryCONTperCATE[5]) < diff) {
              diff <- summaryCONTperCATE[6]-summaryCONTperCATE[5]
              
              minCONT <- summaryCONTperCATE[5]
              maxCONT <- summaryCONTperCATE[6]
            }
            
            

            function_formatter_CATE_name <- get_value_formatter(variableCATEName, metadata)
            function_formatter_CONT_name <- get_value_formatter(variableCONTName, metadata)
            
            
            if (!is.na(function_formatter_CATE_name) && !is.null(function_formatter_CATE_name) && function_formatter_CATE_name != "") {
              function_formatter_CATE <- get(function_formatter_CATE_name)
            } else {
              function_formatter_CATE <- identity
            }
            
            if (!is.na(function_formatter_CONT_name) && !is.null(function_formatter_CONT_name) && function_formatter_CONT_name != "") {
              function_formatter_CONT <- get(function_formatter_CONT_name)
            } else {
              function_formatter_CONT <- identity
            }
            
            jsonText <- paste0("[",
                                "  {\"contextual_element_id\":\"", variableCATEName, "\", \"value\":\"", format_template_CATE(get_template_description(variableCATEName, metadata),function_formatter_CATE, list_of_cate_instances_associated_with_cont_rank_mean[[m]]), "\"},",
                                "  {\"contextual_element_id\":\"", variableCONTName, "\", \"value\":\"", format_template_CONT(get_template_description(variableCONTName, metadata),get_subtemplate_negative(variableCONTName, metadata), get_subtemplate_positive(variableCONTName, metadata), function_formatter_CONT, minCONT, maxCONT), "\"}]")
            
            
            
            

            
            listJSONobjects[[length(listJSONobjects)+1]] <- fromJSON(jsonText)

          }
          
          
          

          
          
          
          
          
          
        
          
        }
        
      }, warning = function(w){
        paste("warning, do nothing")
      }, error = function(e){
        if (isTRUE(DEBUG_MODE)) {
          message("error: ", e)
        }
        
        warning_or_error <- TRUE
      }, finally = function(f){

      })
      
      
    
      
      
      
      
      ### END CATE-CONT
      
    }
    
    
  }
  
  
}




# identifying context paths



context_path_stack <- vector()
context_components <- vector()



for (i in 1:length(listJSONobjects)) {
  
  
  if(isRoot(listJSONobjects[[i]], listJSONobjects)) {

    stackIt(TRUE, listJSONobjects[[i]], listJSONobjects, context_path_stack)
  }
  
  
  
}


headerJSON <- "{"


taskJSON <- paste0("\"analyzed_tasks\": [ {\"id\":\"", gsub(" ", "_", args$task), "\", \"name\":\"", args$task, "\",")

contextsJSON <- paste0("\"contexts\":[",paste(context_components, collapse = ","),"]")

tailJSON <- "} ] }"


fileConn <- file("contexts.json")

writeLines(paste0(headerJSON, taskJSON, contextsJSON, tailJSON), fileConn)
close(fileConn)

