import { Button, Card, CardBody, Checkbox, Divider, Input, Skeleton } from "@nextui-org/react";
import { Field, Form, Formik } from "formik";
import { useSettingsContext } from "../context/settings";
import { remoteConfigSchema } from "../lib/remote-config";
import { FormWrapper } from "./form-wrapper";

const RemoteConfigError = ({ message }: { message:string }) => (
    <Card className="text-white bg-danger-500">
        <CardBody>
            <p>
                {message}
            </p>
        </CardBody>
    </Card>
)

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
    const { loading, settings, remoteSettingsErrror, updateSettings, resetSettings } = useSettingsContext();
    const confirmResetSettings = () => {
        if (confirm('This will reset the remote configuration and local settings to their default state')) {
            resetSettings();   
        }
    }

    if (loading) {
        return (
            <FormWrapper>
                <RemoteFormSkeleton />
            </FormWrapper>
        )
    }

    const { useRemote, remoteUrl } = settings;

    return (
        <>
            {remoteSettingsErrror ? <RemoteConfigError message={remoteSettingsErrror} /> : ''}
            <FormWrapper>
                <Formik 
                    validationSchema={remoteConfigSchema}
                    initialValues={{ useRemote, remoteUrl }} 
                    onSubmit={(values, actions) => {
                        updateSettings({ ...settings, ...values });
                        actions.setSubmitting(false);
                    }}
                >
                    {({ errors, touched, values }) => (
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
                            <Button type="submit" className='mr-3'>
                                {values.useRemote ? 'Save & Fetch Remote Config' : 'Save'}
                            </Button>
                            <Button type="button" color="danger" onClick={() => confirmResetSettings()}>Reset all settings</Button>
                        </Form>
                    )}
                </Formik>
            </FormWrapper>
        </>
    )
}