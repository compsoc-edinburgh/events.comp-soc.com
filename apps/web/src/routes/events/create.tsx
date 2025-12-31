import { createFileRoute } from '@tanstack/react-router'
import { ChevronDownIcon, InfoIcon } from 'lucide-react'
import { useState } from 'react'
import { addYears } from 'date-fns'
import Window from '@/components/module/layout/window/window.tsx'
import Sheet from '@/components/module/layout/sheet.tsx'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ALL_SIGS } from '@/config/sigs.ts'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
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

export const Route = createFileRoute('/events/create')({
  component: CreateRoute,
})

function CreateRoute() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Window activeTab="/events/create">
      <Sheet>
        <div className="text-2xl font-bold gap-2 items-center flex text-white">
          Create Event
        </div>
        <div>
          <div className="flex gap-2 items-center mt-1.5 text-neutral-400 text-sm">
            Fill in the details below to create a new event. You can either
            publish it or save it as a draft.
          </div>
        </div>

        <div className="h-px bg-neutral-800 my-5" />

        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Event Details</FieldLegend>
              <FieldDescription>
                Provide the key details about the event
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Title
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="Evil Rabbit"
                    required
                  />
                </Field>
                <Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-exp-month-ts6">
                      Orginiser
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-exp-month-ts6">
                        <SelectValue placeholder="Project Share" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_SIGS.map((sig) => (
                          <SelectItem value={`${sig.id}`}>
                            {sig.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <FieldDescription>
                    Choose the student interest group responsible for this event
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Capacity
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="None"
                    required
                  />
                  <FieldDescription>
                    Defines the maximum number of registrations. An empty value
                    indicates no limit
                  </FieldDescription>
                </Field>
                <Field className="flex gap-4 flex-row">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date-picker" className="px-1">
                      Date
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="justify-between font-normal"
                        >
                          {date ? date.toLocaleDateString() : 'Select date'}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          endMonth={addYears(new Date(), 3)}
                          startMonth={new Date()}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      defaultValue="10:30:00"
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    About
                  </FieldLabel>
                  <Tabs defaultValue="edit">
                    <TabsList className="mb-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <Field>
                        <Textarea
                          id="checkout-7j9-card-name-43j"
                          placeholder="Write a detailed event description (Markdown supported)"
                          required
                        />
                      </Field>
                    </TabsContent>
                    <TabsContent value="preview">
                      <Field>
                        <Textarea
                          id="checkout-7j9-card-name-43j"
                          placeholder="Write a detailed event description (Markdown supported)"
                          required
                        />
                      </Field>
                    </TabsContent>
                  </Tabs>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Location
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="None"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Location URL
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="example.com"
                      className="pl-1!"
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
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet className="mb-10">
              <FieldLegend>Registration Form</FieldLegend>
              <FieldDescription>
                Choose whether attendees need to fill out a form when
                registering
              </FieldDescription>

              <FieldGroup>
                <Field orientation="horizontal">
                  <Switch id="event-registration-form" />

                  <FieldLabel
                    htmlFor="event-registration-form"
                    className="font-normal"
                  >
                    Require additional registration details
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button">
                Save as draft
              </Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </Sheet>
    </Window>
  )
}
