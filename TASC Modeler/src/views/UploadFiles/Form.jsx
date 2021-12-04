import { useCallback } from "react"
import { FormProvider, useForm } from "react-hook-form"
import FileInput from "./FileInput"
import * as yup from "yup";
import { ErrorMessage } from '@hookform/error-message';
const useYupValidationResolver = validationSchema =>
    useCallback(
        async data => {
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false
                });

                return {
                    values,
                    errors: {}
                };
            } catch (errors) {
                return {
                    values: {},
                    errors: errors.inner.reduce(
                        (allErrors, currentError) => ({
                            ...allErrors,
                            [currentError.path]: {
                                type: currentError.type ?? "validation",
                                message: currentError.message
                            }
                        }),
                        {}
                    )
                };
            }
        },
        [validationSchema]
    );

const validationSchema = yup.object({
    dataSet: yup.mixed().required("The dataset file is required"),
    metadata: yup.mixed().required("The metadata file is required"),
    description: yup.string().required("The description is required")
});

const Form = ({generateDiagram}) => {
    const resolver = useYupValidationResolver(validationSchema);
    const methods = useForm({
        resolver,
        mode: "onBlur",
    });
    const { register, handleSubmit, formState: { errors } } = methods;
    const onSubmit = handleSubmit( ({description, dataSet, metadata}) => {
        generateDiagram(description,  dataSet[0], metadata[0] );
    });

    return (
        <FormProvider {...methods} >
            <form onSubmit={onSubmit} className="formContainer">
                <div className="">
                    <FileInput
                        accept=".csv"
                        name="dataSet"
                        label="Upload dataset: "
                    />
                    <ErrorMessage errors={errors} name="dataSet" render={({ message }) => <p style={{color: 'tomato'}}>{message}</p>}/>
                </div>
                <div className="">
                    <FileInput
                        accept=".csv"
                        name="metadata"
                        label="Upload metadata: "
                    />
                    <ErrorMessage errors={errors} name="metadata" render={({ message }) => <p style={{color: 'tomato'}}>{message}</p>}/>
                </div>
                <div className="">
                    <label>Task description: </label>
                </div>
                <div>
                    <input className="inputText" {...register("description")} />
                    <ErrorMessage errors={errors} name="description" render={({ message }) => <p style={{color: 'tomato'}}>{message}</p>}/>
                </div>
                <div className="form-button-container" >
                    <input type="submit" className="submitBtn" value="Generate"/>
                </div>
            </form>
        </FormProvider>
    )
}

export default Form;