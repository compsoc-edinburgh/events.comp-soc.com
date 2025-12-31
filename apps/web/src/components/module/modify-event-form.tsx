import * as z from 'zod'
import { useState } from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import { toast } from 'sonner'
import { ChevronDownIcon, InfoIcon, PlusIcon, XIcon } from 'lucide-react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { ALL_SIGS } from '@/config/sigs.ts'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Markdown } from '@/components/markdown.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { Switch } from '@/components/ui/switch.tsx'

export const eventSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    organiser: z.string().min(1, 'Organiser is required'),
    date: z.date(),
    description: z.string(),
    capacity: z.string(),
    locationUrl: z.string(),
    time: z.string().min(1, 'Time is required'),
    location: z.string().min(1, 'Location is required'),
    registrationFormEnabled: z.boolean(),
    customFields: z.array(
      z.object({
        id: z.string(),
        type: z.enum(['input', 'textarea', 'select']),
        label: z.string().min(1, 'Label is required'),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
      }),
    ),
  })
  .superRefine((form, ctx) => {
    if (form.registrationFormEnabled && form.customFields.length === 0) {
      ctx.addIssue({
        path: ['registrationFormEnabled'],
        message:
          'At least one custom field is required when registration form is enabled',
        code: 'custom',
      })
    }
  })

type CustomField = {
  id: string
  type: 'input' | 'textarea' | 'select'
  label: string
  required: boolean
  options?: Array<string>
}

function ModifyEventForm({
  onFormSubmit,
}: {
  onFormSubmit: (value: z.infer<typeof eventSchema>) => void
}) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      organiser: '',
      date: new Date(),
      time: '',
      location: '',
      description: '',
      capacity: '',
      locationUrl: '',
      registrationFormEnabled: false,
      customFields: [] as Array<CustomField>,
    },
    validators: {
      onSubmit: eventSchema,
    },
    onSubmit: ({ value }) => {
      toast.success('Form submitted successfully')
      onFormSubmit(value)
    },
  })

  const registrationFormEnabled = useStore(
    form.store,
    (state) => state.values.registrationFormEnabled,
  )

  const customFields = useStore(
    form.store,
    (state) => state.values.customFields,
  )

  const addCustomField = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      type: 'input',
      label: '',
      required: false,
    }
    form.setFieldValue('customFields', [...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    form.setFieldValue(
      'customFields',
      customFields.filter((field) => field.id !== id),
    )
  }

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    form.setFieldValue(
      'customFields',
      customFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    )
  }

  return (
    <form
      id="event-form"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Event Details</FieldLegend>
          <FieldDescription>
            Provide the key details about the event
          </FieldDescription>
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Evil Rabbit"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="organiser"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Organiser</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue
                          placeholder="Select an organiser"
                          aria-invalid={isInvalid}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_SIGS.map((sig) => (
                          <SelectItem key={sig.id} value={sig.id}>
                            {sig.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="capacity"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="None"
                    />
                    <FieldDescription>
                      Defines the maximum number of registrations. An empty
                      value indicates no limit
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {field.state.value.toLocaleDateString()}
                          <ChevronDownIcon className="ml-auto" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(selected) => {
                            if (selected) {
                              field.handleChange(selected)
                            }
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="time"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Time</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      step="1"
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>About</FieldLabel>
                    <Tabs defaultValue="edit">
                      <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit">
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Write a detailed event description (Markdown supported)"
                        />
                      </TabsContent>
                      <TabsContent value="preview">
                        <Markdown content={field.state.value} />
                      </TabsContent>
                    </Tabs>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <Separator />

            <form.Field
              name="location"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Room 123, Building A"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="locationUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Location URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="example.com"
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InputGroupButton
                              className="rounded-full"
                              size="icon-xs"
                            >
                              <InfoIcon />
                            </InputGroupButton>
                          </TooltipTrigger>
                          <TooltipContent>
                            Use location from Google Maps
                          </TooltipContent>
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      If provided, a Google Maps location will be shown on the
                      event details page
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />

        <FieldSet className="mb-10">
          <FieldLegend>Registration Form</FieldLegend>
          <FieldDescription>
            Choose whether attendees need to fill out a form when registering
          </FieldDescription>
          <FieldGroup>
            <form.Field
              name="registrationFormEnabled"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field orientation="horizontal">
                    <Switch
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    <FieldLabel htmlFor={field.name} className="font-normal">
                      Require additional registration details
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {registrationFormEnabled && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Custom Fields</h4>
                    <p className="text-sm text-muted-foreground">
                      Add custom fields to your registration form
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={addCustomField}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-border p-4 space-y-4"
                  >
                    <div className="flex justify-end w-full">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <Field>
                        <FieldLabel>Field Type</FieldLabel>
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateCustomField(field.id, {
                              type: value as CustomField['type'],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="input">Text Input</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                            <SelectItem value="select">
                              Select Dropdown
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel>Label</FieldLabel>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateCustomField(field.id, {
                              label: e.target.value,
                            })
                          }
                          placeholder="Enter field label"
                        />
                      </Field>

                      {field.type === 'select' && (
                        <Field>
                          <FieldLabel>Options</FieldLabel>
                          <Textarea
                            value={field.options?.join('\n') || ''}
                            onChange={(e) =>
                              updateCustomField(field.id, {
                                options: e.target.value
                                  .split('\n')
                                  .filter((opt) => opt.trim()),
                              })
                            }
                            placeholder="Enter each option on a new line"
                            rows={4}
                          />
                          <FieldDescription>
                            Enter each option on a separate line
                          </FieldDescription>
                        </Field>
                      )}

                      <Field orientation="horizontal">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            updateCustomField(field.id, {
                              required: checked,
                            })
                          }
                        />
                        <FieldLabel className="font-normal">
                          Required field
                        </FieldLabel>
                      </Field>
                    </div>
                  </div>
                ))}

                {customFields.length === 0 && (
                  <div className="rounded-lg border border-border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No custom fields added yet. Click "Add Field" to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            )}
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit" form="event-form">
            Submit
          </Button>
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Clear
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ModifyEventForm
