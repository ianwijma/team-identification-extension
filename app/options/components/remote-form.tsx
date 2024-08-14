import { Button, Checkbox, Divider, Input, Skeleton } from "@nextui-org/react";
import { Field, Form, Formik } from "formik";
import { useSettingsContext } from "../context/settings";
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
                initialValues={{ useRemote, remoteUrl }} 
                onSubmit={(values, actions) => {
                    updateSettings({ ...settings, ...values });
                    actions.setSubmitting(false);
                }}
            >
                {() => (
                    <Form>
                        <Field name='useRemote'>
                            {
                                ({field}: any) => 
                                    <Checkbox {...field} defaultSelected={field.value}>Use Remote Configuration Url</Checkbox>
                            }
                        </Field>
                        <Divider className="my-3" />
                        <Field name='remoteUrl'>
                            {
                                ({field}: any) => 
                                    <Input label="Remote Configuration Url" type='url' {...field}/>
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