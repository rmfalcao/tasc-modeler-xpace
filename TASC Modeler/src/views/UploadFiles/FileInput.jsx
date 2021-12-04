import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext } from "react-hook-form"

const FileInput = (props) => {
    const { name, label = name } = props
    const { register, unregister, setValue, watch } = useFormContext()
    const files = watch(name)
    const onDrop = useCallback(
        droppedFiles => {
            setValue(name, droppedFiles, { shouldValidate: true })
        },
        [setValue, name]
    )   
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: props.accept,
        multiple: false 
    })
    useEffect(() => {
        register(name)
        return () => {
            unregister(name)
        }
    }, [register, unregister, name])
    return (
        <>
            <div className="form-label-container" htmlFor={name}>
                {label}
            </div>
            <div
                {...getRootProps()}
                type="file"
                role="button"
                aria-label="File Upload"
                className="dropzone"
                id={name}
            >
                <input {...props} {...getInputProps()} />
                <div
                    className={" " + (isDragActive ? " " : " ")}
                >
                    <p className=" ">Drag and drop your file here, or click to select it ...</p>

                    {!!files?.length && (
                        <div className=" ">
                            {files.map(file => {
                                return (
                                    <div key={file.name}>
                                        <label style={{color: 'GrayText'}}>{file.name}</label>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FileInput