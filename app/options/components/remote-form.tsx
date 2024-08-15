import { Button, Checkbox, Divider, Input, Skeleton } from "@nextui-org/react";
import { Field, Form, Formik } from "formik";
import { useSettingsContext } from "../context/settings";
import { remoteConfigSchema } from "../lib/remote-config";
import { FormWrapper } from "./form-wrapper";

const RemoteFormSkeleton = () => {
    return (
        <>
            <Skeleton className="rounded-lg">
                <Checkbox>Use Remote Configuration Url</Checkbox>
            </Skeleton>
            <Divider className="my-3" />
            <Skeleton className="rounded-lg">
                <Input label="Remote Configuration Url" />
            </Skeleton>
            <Divider className="my-3" />
            <Skeleton className="rounded-lg">
                <Button type="button">Save</Button>
            </Skeleton>
        </>
    )
}

export const RemoteForm = () => {
    const { loading, settings, updateSettings } = useSettingsContext();

    if (loading) {
        return (
            <FormWrapper>
                <RemoteFormSkeleton />
            </FormWrapper>
        )
    }

    const { useRemote, remoteUrl } = settings;

    return (
        <FormWrapper>
            <Formik 
                validationSchema={remoteConfigSchema}
                initialValues={{ useRemote, remoteUrl }} 
                onSubmit={(values, actions) => {
                    updateSettings({ ...settings, ...values });
                    actions.setSubmitting(false);
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field name='useRemote'>
                            {
                                ({field}: any) => 
                                    <Checkbox  
                                        errorMessage={errors.useRemote} 
                                        isInvalid={errors.useRemote && touched.useRemote} 
                                        defaultSelected={field.value}
                                        {...field}>
                                            Use Remote Configuration
                                    </Checkbox>
                            }
                        </Field>
                        <Divider className="my-3" />
                        <Field name='remoteUrl'>
                            {
                                ({field}: any) => 
                                    <Input 
                                        errorMessage={errors.remoteUrl} 
                                        isInvalid={errors.remoteUrl && touched.remoteUrl} 
                                        label="Remote Configuration Url" 
                                        type='url' 
                                        {...field}/>
                             }
                        </Field>
                        <Divider className="my-3" />
                        <Button type="submit">Save</Button>
                    </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}