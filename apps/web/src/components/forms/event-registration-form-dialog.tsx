import { useForm } from '@tanstack/react-form'

import * as z from 'zod'

import { RegistrationAnswerSchema } from '@events.comp-soc.com/shared'
import type {
  CustomField,
  RegistrationFormAnswer,
} from '@events.comp-soc.com/shared'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'

function buildRegistrationSchema(formStructure: Array<CustomField>) {
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  formStructure.forEach((field) => {
    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case 'input':
      case 'textarea':
        fieldSchema = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional()
        break
      case 'select':
        if (field.options && field.options.length > 0) {
          fieldSchema = field.required
            ? z.enum(field.options as [string, ...Array<string>], {
                error: () => ({ message: `${field.label} is required` }),
              })
            : z.enum(field.options as [string, ...Array<string>]).optional()
        } else {
          fieldSchema = z.string().optional()
        }
        break
      default:
        fieldSchema = z.string().optional()
    }

    schemaShape[field.id] = fieldSchema
  })

  return z.object(schemaShape)
}

function buildDefaultValues(formStructure: Array<CustomField>) {
  const defaultValues: Record<string, string> = {}

  formStructure.forEach((field) => {
    defaultValues[field.id] = ''
  })

  return defaultValues
}

function EventRegistrationFormDialog({
  onFormSubmit,
  formStructure,
  isLoading = false,
  isOpen,
  onOpenChange,
  eventTitle,
}: {
  onFormSubmit: (value: RegistrationFormAnswer) => void
  formStructure: Array<CustomField>
  isLoading?: boolean
  isOpen: boolean
  onOpenChange: () => void
  eventTitle: string
}) {
  const RegistrationSchema = buildRegistrationSchema(formStructure)
  const defaultValues: z.infer<typeof RegistrationSchema> =
    buildDefaultValues(formStructure)

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: RegistrationSchema,
    },
    onSubmit: ({ value }) => {
      const mappedData = RegistrationAnswerSchema.parse(value)
      onFormSubmit(mappedData)
    },
  })

  const renderField = (field: CustomField) => {
    switch (field.type) {
      case 'input':
        return (
          <form.Field
            key={field.id}
            name={field.id}
            children={(formField) => {
              const isInvalid =
                formField.state.meta.isTouched && !formField.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={formField.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FieldLabel>
                  <Input
                    id={formField.name}
                    name={formField.name}
                    disabled={isLoading}
                    value={(formField.state.value as string) || ''}
                    onBlur={formField.handleBlur}
                    onChange={(e) => formField.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    autoComplete="off"
                  />
                  {isInvalid && (
                    <FieldError errors={formField.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
        )

      case 'textarea':
        return (
          <form.Field
            key={field.id}
            name={field.id}
            children={(formField) => {
              const isInvalid =
                formField.state.meta.isTouched && !formField.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={formField.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FieldLabel>
                  <Textarea
                    id={formField.name}
                    name={formField.name}
                    disabled={isLoading}
                    value={(formField.state.value as string) || ''}
                    onBlur={formField.handleBlur}
                    onChange={(e) => formField.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={4}
                  />
                  {isInvalid && (
                    <FieldError errors={formField.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
        )

      case 'select':
        return (
          <form.Field
            key={field.id}
            name={field.id}
            children={(formField) => {
              const isInvalid =
                formField.state.meta.isTouched && !formField.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={formField.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FieldLabel>
                  <Select
                    name={formField.name}
                    disabled={isLoading}
                    value={(formField.state.value as string) || ''}
                    onValueChange={(value) => formField.handleChange(value)}
                  >
                    <SelectTrigger aria-invalid={isInvalid}>
                      <SelectValue
                        placeholder={`Select ${field.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && (
                    <FieldError errors={formField.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form
        id="registration-form"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {eventTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please fill out the additional details below to secure your spot.
          </DialogDescription>
          <div className="max-h-[65vh] overflow-auto py-5">
            <FieldGroup>
              {formStructure.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No registration fields configured for this event.
                  </p>
                </div>
              ) : (
                <>{formStructure.map((field) => renderField(field))}</>
              )}
            </FieldGroup>
          </div>
          <DialogFooter className="justify-start!">
            <Button
              type="submit"
              form="registration-form"
              className="w-full md:max-w-fit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default EventRegistrationFormDialog
