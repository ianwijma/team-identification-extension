import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Input, Skeleton, Textarea } from "@nextui-org/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { useSettingsContext } from "../context/settings";
import { TeamMap } from "../lib/extension-settings";
import { localSettingsSchema } from "../lib/local-settings";
import { FormWrapper } from "./form-wrapper";

const RemoteConfigNotice = () => (
    <Card className="text-white bg-primary-500">
        <CardBody>
            <p>
                While using remote configuration, local settings are loaded from the remote configuration.
            </p>
        </CardBody>
    </Card>
)

const LocalFormSkeleton = ({ useRemote }: { useRemote: boolean }) => {
    return (
        <>
            <Skeleton className="rounded-lg">
                <Input label="Element attribute name" />
            </Skeleton>
            <Divider className="my-3" />
            <Skeleton className="rounded-lg">
                <Input label="Request header name" />
            </Skeleton>
            <Divider className="my-3" />
            <Skeleton className="rounded-lg">
                <Input label="Response header name" />
            </Skeleton>
            <Divider className="my-3" />
            <Skeleton className="rounded-lg">
                { useRemote ? <RemoteConfigNotice /> : <Button type="submit">Save</Button> }
            </Skeleton>
        </>
    )
}

export const LocalForm = () => {
    const { loading, settings, updateSettings } = useSettingsContext();
    const { useRemote } = settings

    if (loading) {
        return (
            <FormWrapper>
                <LocalFormSkeleton useRemote={useRemote} />
            </FormWrapper>
        )
    }

    const { elementAttributeName, requestHeaderName, responseHeaderName, teamMap } = settings;
    
    return (
        <FormWrapper>
            <Formik 
                validationSchema={localSettingsSchema}
                initialValues={{ elementAttributeName, requestHeaderName, responseHeaderName, teams: Object.values(teamMap) }} 
                onSubmit={(values, actions) => {
                    const { teams, ...restValue } = values;

                    const teamMap = teams.reduce((map, team) => {
                        map[team.alias] = team;

                        return map;
                    }, {} as TeamMap);

                    updateSettings({ ...settings, ...restValue, teamMap  });

                    actions.setSubmitting(false);

                }}>
                {({ values, errors, touched }) => (
                    <Form>
                        <Field name='elementAttributeName'>
                            {
                                ({field}: any) => 
                                    <Input 
                                        errorMessage={errors.elementAttributeName} 
                                        isInvalid={errors.elementAttributeName && touched.elementAttributeName} 
                                        disabled={useRemote} 
                                        label="Element attribute name" 
                                        {...field}/>
                            }
                        </Field>
                        <Divider className="my-3" />
                        <Field name='requestHeaderName'>
                            {
                                ({field}: any) => 
                                    <Input 
                                        errorMessage={errors.requestHeaderName} 
                                        isInvalid={errors.requestHeaderName && touched.requestHeaderName} 
                                        disabled={useRemote} 
                                        label="Request header name" 
                                        {...field}/>
                            }
                        </Field>
                        <Divider className="my-3" />
                        <Field name='responseHeaderName'>
                            {
                                ({field}: any) => 
                                    <Input 
                                        errorMessage={errors.responseHeaderName} 
                                        isInvalid={errors.responseHeaderName && touched.responseHeaderName} 
                                        disabled={useRemote} 
                                        label="Response header name"
                                        {...field}/>
                            }
                        </Field>
                        <Divider className="my-3" />
                        <FieldArray
                            name="teams"
                            render={arrayHelpers => (
                                <div>
                                    {
                                        values.teams && values.teams.length > 0 ? (
                                            values.teams.map((team, index) => (
                                                <Card key={index} className='mb-3'>
                                                    <CardHeader>
                                                        {team.name}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="flex h-14 w-full">
                                                            <Field name={`teams[${index}].alias`}>
                                                                {
                                                                    ({field}: any) => 
                                                                        <Input 
                                                                            // @ts-ignore
                                                                            errorMessage={errors?.teams?.[index]?.alias} 
                                                                            // @ts-ignore
                                                                            isInvalid={errors?.teams?.[index]?.alias && touched?.teams?.[index]?.alias} 
                                                                            disabled={useRemote} 
                                                                            className="grow" 
                                                                            label="Team Alias" 
                                                                            {...field}/>
                                                                }
                                                            </Field>
                                                            <Divider className="mx-3" orientation="vertical" />
                                                            <Field name={`teams[${index}].name`}>
                                                                {
                                                                    ({field}: any) => 
                                                                        <Input 
                                                                            // @ts-ignore
                                                                            errorMessage={errors?.teams?.[index]?.name} 
                                                                            // @ts-ignore
                                                                            isInvalid={errors?.teams?.[index]?.name && touched?.teams?.[index]?.name} 
                                                                            disabled={useRemote} 
                                                                            className="grow" 
                                                                            label="Team Name" 
                                                                            {...field}/>
                                                                }
                                                            </Field>
                                                        </div>
                                                        <Divider className="my-3" />
                                                        <Field name={`teams[${index}].description`}>
                                                            {
                                                                ({field}: any) => 
                                                                    <Textarea 
                                                                        // @ts-ignore
                                                                        errorMessage={errors?.teams?.[index]?.description} 
                                                                        // @ts-ignore
                                                                        isInvalid={errors?.teams?.[index]?.description && touched?.teams?.[index]?.description} 
                                                                        disabled={useRemote} 
                                                                        label="Team Description" 
                                                                        {...field}/>
                                                            }
                                                        </Field>
                                                    </CardBody>
                                                    {
                                                            useRemote ? '' : (
                                                                <CardFooter>
                                                                    <Button className="mr-3" onClick={() => arrayHelpers.remove(index)}>
                                                                        Remove Team
                                                                    </Button>
                                                                    <Button onClick={() => arrayHelpers.insert(index+1, {
                                                                        alias: `team-${values.teams.length}`,
                                                                        name: `Team ${values.teams.length}`,
                                                                        description: '',
                                                                    })}>
                                                                        Add Team
                                                                    </Button>
                                                                </CardFooter>
                                                            )
                                                        }
                                                </Card>
                                            ))
                                    ) : (
                                        <>
                                            {
                                                useRemote ? '' : (
                                                    <Button onClick={() => {
                                                        console.log('added');
                                                        arrayHelpers.push({
                                                            alias: `team-${values.teams.length}`,
                                                            name: `Team ${values.teams.length}`,
                                                            description: '',
                                                        })
                                                    }}>
                                                        Add First Team
                                                    </Button>
                                                )
                                            }
                                        </>
                                    )}
                                </div>
                            )}
                        />
                        <Divider className="my-3" />

                        { useRemote ? <RemoteConfigNotice /> : <Button type="submit">Save</Button> }
                    </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}