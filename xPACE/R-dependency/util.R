isCategoryInList <- function(instance, list_categories) {
  

  
  if (length(list_categories) > 0) {
    for (i in 1:length(list_categories)) {
      
      if (list_categories[i] == instance) {
        return(TRUE)
      }
    }
  }
  
  return(FALSE)
  
}

formatTimeDiffInHoursAndMinutes <- function(x) {
  
  number_in_minutes <- abs(x)
  number_in_hours <- number_in_minutes %/% 60
  number_in_minutes %% 60
  
  if (number_in_hours > 0) {
    formatted_hours <- sprintf("%dh%dmin", number_in_hours, round(number_in_minutes %% 60))
  } else {
    formatted_hours <- sprintf("%dmin", round(number_in_minutes %% 60))
  }
  
  return(formatted_hours)
  
}

formatYesNo <- function(x) {
  if (x == "Y") {
    return(" ")
    
  } else if (x == "N") {
    return("not")
    
  }
  
  return(x)
}


formatValue <- function(variable_name, value) {
  
  result <- ""

    
  value_mapper <- get_value_formatter(variable_name, metadata)
  
  if(!is.null(value_mapper) && value_mapper != "" ) {
    
    f <- get(value_mapper)
   
  } else {
    f <- identity
  }
  
  result <- paste0(result,"\"", f(value), "\"")

  
  return(result)
}

itemsAreEqual <- function(item1, item2) {
  
  if (item1[1,1] == item2[1,1] &&
      unlist(item1[1,2]) == unlist(item2[1,2]) &&
      item1[2,1] == item2[2,1] &&
      unlist(item1[2,2]) == unlist(item2[2,2]) ) {
    return(TRUE)
  }
  return(FALSE)
  
}



partialItemsAreEqual <- function(origin, destiny) {
  

  if (origin[[1]] == destiny[[1]]
      &&
      unlist(origin[[2]]) == unlist(destiny[[2]])) {

    return(TRUE)
  }

  return(FALSE)
  
}




stackIt <- function(isRootItem, item, items, context_path_stack) {
  
  
  if (isRootItem) {
    

    context_path_stack[length(context_path_stack)+1] <- paste0("{\"contextual_element_id\": \"",item[1,1],"\",\"value\":\"",unlist(item[1,2]), "\"}")
    
  }
  

  
  context_path_stack[length(context_path_stack)+1] <- paste0("{\"contextual_element_id\": \"",item[2,1],"\",\"value\":\"",unlist(item[2,2]), "\"}")
  
  isLeaf <- TRUE
  
  for (i in 1:length(items)) {
    
    
    
    
    

    if (partialItemsAreEqual(item[2,], items[[i]][1,])) {
      isLeaf <- FALSE
      stackIt(FALSE, items[[i]], items, context_path_stack)
    } 

    
  }
  
  if (isLeaf) {

    context_components[length(context_components)+1] <<- paste0("{\"instances\": [", paste(context_path_stack, collapse=","), "]}")
  }
  
}





isRoot <- function(item, items) {

  for (i in 1:length(items)) {
    
    if(paste(item[1,1], item[1,2]) == paste(items[[i]][2,1], items[[i]][2,2])) {

      
      return(FALSE)
    }
    
  }

  return(TRUE)
}



format_contextual_elements_as_vector <- function(metadata_ds) {
  
  vector_metadata <- vector()
  for (index_metadata in 1:nrow(metadata_ds)) {
    vector_metadata[length(vector_metadata)+1] <- paste0("{\"id\":\"", metadata_ds[index_metadata,]$id,"\",\"template_description\":\"", metadata_ds[index_metadata,]$template_description, "\", \"is_intrinsic\":", tolower(metadata_ds[index_metadata,]$is_intrinsic),"}")
  }
  
  return(vector_metadata)
  
}

get_type_of_variable <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$variable_type)  
}

is_always_analyzed <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$is_always_analyzed)  
}

get_value_formatter <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$value_formatter)  
}

get_template_description <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$template_description)  
}

use_minimal_variable <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$minimize)  
}

use_maximal_variable <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$maximize)  
}

get_subtemplate_negative <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$subtemplate_negative)  
}

get_subtemplate_positive <- function(variable_name, metadata_ds) {
  return(metadata[metadata$id == variable_name,]$subtemplate_positive)  
}



format_template_CONT <- function (template_desc, subtemplate_neg, subtemplate_pos, value_formatter, minCONT, maxCONT) {
  
  value_ce_cont <- template_desc
  
  if (minCONT < 0) {
    if (!is.na(subtemplate_neg) && subtemplate_neg != "") {
      value_ce_cont <- sub("\\?", subtemplate_neg, value_ce_cont)
    }
  } else {
    if (!is.na(subtemplate_pos) && subtemplate_pos != "") {
      value_ce_cont <- sub("\\?", subtemplate_pos, value_ce_cont)
    }
  }
  

  value_ce_cont <- sub("\\?", value_formatter(minCONT), value_ce_cont)
  
  if (maxCONT < 0) {
    if (!is.na(subtemplate_neg) && subtemplate_neg != "") {
 
      value_ce_cont <- sub("\\?", subtemplate_neg, value_ce_cont)
    }
  } else {
    if (!is.na(subtemplate_pos) && subtemplate_pos != "") {
 
      value_ce_cont <- sub("\\?", subtemplate_pos, value_ce_cont)
    }
  }
  
  value_ce_cont <- sub("\\?", value_formatter(maxCONT), value_ce_cont)
  
  return(value_ce_cont)
  
  
}


format_template_CATE <- function (template_desc, value_formatter, categorical_value) {
  value_ce_cate <- template_desc
  value_ce_cate <- sub("\\?", value_formatter(categorical_value), value_ce_cate)
  return(value_ce_cate)
  
}