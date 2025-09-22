import React, { useId, useState } from 'react';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { SelectNative } from '@/registry/default/ui/select-native';
import { DotIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@registry/default/ui/radio-group';
import { Tag, TagInput } from '@registry/default/ui/tag-input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@registry/default/ui/select';

const items = [
  { value: 'low', label: 'Low', classname: 'text-green-400' },
  { value: 'medium', label: 'Medium', classname: 'text-orange-400' },
  { value: 'high', label: 'High', classname: 'text-rose-400' },
];

const tags = [
  {
    id: '1',
    text: 'Red',
  },
];

const PersonAddPage: React.FC = () => {
  const id = useId();
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="h-full w-full flex ">
      <div className="w-full md:w-1/2 flex flex-col justify-between   pr-6 space-y-4 py-4   border-r">
        <div className="space-y-0">
          <h1 className="text-xl font-bold leading-tight">Create new ticket</h1>
          <p className="text-sm text-muted-foreground">sdfdsfdsf</p>
        </div>
        <div className="w-full h-full flex justify-center ">
          <div className="w-full flex flex-col space-y-3">
            <div className="flex w-60 items-center space-x-2  *:not-first:mt-2">
              <Label htmlFor={id}>From</Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id={id}
                  className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
                >
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                  <SelectGroup>
                    <SelectLabel className="ps-2">Impersonate user</SelectLabel>
                    <SelectItem value="1">
                      <img
                        className="size-5 rounded"
                        src="/avatar-20-01.jpg"
                        alt="Frank Allison"
                        width={20}
                        height={20}
                      />
                      <span className="truncate">Jenny Hamilton</span>
                    </SelectItem>
                    <SelectItem value="2">
                      <img
                        className="size-5 rounded"
                        src="/avatar-20-02.jpg"
                        alt="Xavier Guerra"
                        width={20}
                        height={20}
                      />
                      <span className="truncate">Paul Smith</span>
                    </SelectItem>
                    <SelectItem value="3">
                      <img
                        className="size-5 rounded"
                        src="/avatar-20-03.jpg"
                        alt="Anne Kelley"
                        width={20}
                        height={20}
                      />
                      <span className="truncate">Luna Wyen</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center  p-6 md:p-0 flex-col ">
        <div className="w-full h-full flex justify-center items-center">
          <div className="lg:max-w-md w-full space-y-2">
            <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
              <div className="space-y-4">
                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>
                    Ticket name <span className="text-destructive">*</span>
                  </Label>
                  <Input id={id} placeholder="Email" type="email" required />
                </div>

                <fieldset className="*:not-first:mt-2">
                  <legend className="text-foreground text-sm leading-none font-medium">
                    Priority
                  </legend>
                  <RadioGroup className="grid grid-cols-3 gap-2" defaultValue="1">
                    {items.map((item) => (
                      <label
                        key={`${id}-${item.value}`}
                        className="border-input  has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-2 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                      >
                        <RadioGroupItem
                          id={`${id}-${item.value}`}
                          value={item.value}
                          className="sr-only after:absolute after:inset-0"
                        />
                        <p className="text-foreground flex items-center text-sm leading-none font-medium">
                          <DotIcon size={30} className={item.classname}></DotIcon>
                          {item.label}
                        </p>
                      </label>
                    ))}
                  </RadioGroup>
                </fieldset>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>Ticket type</Label>
                  <SelectNative id={id}>
                    <option value="incident">Incident</option>
                    <option value="problem">Problem</option>
                    <option value="question">Question</option>
                    <option value="suggestion">Suggestion</option>
                  </SelectNative>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>Requester</Label>
                  <Select defaultValue="1">
                    <SelectTrigger
                      id={id}
                      className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
                    >
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                      <SelectGroup>
                        <SelectLabel className="ps-2">Impersonate user</SelectLabel>
                        <SelectItem value="1">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-01.jpg"
                            alt="Frank Allison"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Jenny Hamilton</span>
                        </SelectItem>
                        <SelectItem value="2">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-02.jpg"
                            alt="Xavier Guerra"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Paul Smith</span>
                        </SelectItem>
                        <SelectItem value="3">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-03.jpg"
                            alt="Anne Kelley"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Luna Wyen</span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>Assigne</Label>
                  <Select defaultValue="1">
                    <SelectTrigger
                      id={id}
                      className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
                    >
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                      <SelectGroup>
                        <SelectLabel className="ps-2">Impersonate user</SelectLabel>
                        <SelectItem value="1">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-01.jpg"
                            alt="Frank Allison"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Jenny Hamilton</span>
                        </SelectItem>
                        <SelectItem value="2">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-02.jpg"
                            alt="Xavier Guerra"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Paul Smith</span>
                        </SelectItem>
                        <SelectItem value="3">
                          <img
                            className="size-5 rounded"
                            src="/avatar-20-03.jpg"
                            alt="Anne Kelley"
                            width={20}
                            height={20}
                          />
                          <span className="truncate">Luna Wyen</span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={id}>Tags</Label>
                  <TagInput
                    id={id}
                    tags={exampleTags}
                    setTags={(newTags) => {
                      setExampleTags(newTags);
                    }}
                    placeholder="Add a tag"
                    styleClasses={{
                      inlineTagsContainer:
                        'border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1',
                      input: 'w-full min-w-[80px] shadow-none px-2 h-7 outline-none',
                      tag: {
                        body: 'h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
                        closeButton:
                          'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground',
                      },
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonAddPage;
