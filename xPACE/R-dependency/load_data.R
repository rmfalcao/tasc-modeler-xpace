
######################
#
# LOADING DATA
#
# INITIAL DATA TRANSFORMATION
#
######################


# load csv
metadata <- read.csv(args$metadata)

metadata$is_always_analyzed <- as.logical(metadata$is_always_analyzed)
metadata$minimize <- as.logical(metadata$minimize)
metadata$maximize <- as.logical(metadata$maximize)
metadata$is_intrinsic <- as.logical(metadata$is_intrinsic)


ds <- read.csv(args$dataset)



for (index_ds in 1:length(ds)) {
  
  if (get_type_of_variable(colnames(ds)[index_ds], metadata) == "CONT") {
    ds[,index_ds] <- as.integer(ds[,index_ds])
  } else if (get_type_of_variable(colnames(ds)[index_ds], metadata) == "CATE") {

    ds[,index_ds] <- as.factor(gsub('-', '_', ds[,index_ds]))
    
    ds[,index_ds][ds[,index_ds]=="blank"] <- NA
    ds[,index_ds][ds[,index_ds]=="NULL"] <- NA
    ds[,index_ds][ds[,index_ds]=="NA"] <- NA
    
  }
  
}


