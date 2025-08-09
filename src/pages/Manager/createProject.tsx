"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";

const availableSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Django",
  "AWS",
  "Java",
  "Spring Boot",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Docker",
  "Kubernetes",
];

// Disallow past start dates (midnight today)
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const projectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().required("Description is required"),
  startDate: yup
    .date()
    .required("Start date is required")
    .min(startOfToday, "Start date cannot be in the past"),
  endDate: yup
    .date()
    .required("End date is required")
    .when(
      "startDate",
      (startDate, schema) =>
        startDate &&
        schema.min(startDate, "End date cannot be before start date")
    ),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["planning", "active", "completed"]),
  skills: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one skill is required")
    .required("At least one skill is required"),
  teamMembers: yup
    .number()
    .required("Number of team members is required")
    .min(1, "At least 1 member is required"),
});

type ProjectFormData = yup.InferType<typeof projectSchema>;

export default function CreateProjectPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      skills: [],
    },
  });

  const startDate = watch("startDate");
  const selectedSkills = watch("skills") || [];

  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);

  const onSubmit = async (data: ProjectFormData) => {
    setServerError(null);
    setServerSuccess(null);

    const payload = {
      name: data.name,
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      status: data.status,
      requiredSkills: data.skills,
      teamSize: data.teamMembers,
    };

    try {
      const response: any = await fetcher('/projects', { method: 'POST', body: payload });
      setServerSuccess('Project created successfully');
      const newId = response?.data?._id ?? response?.data?.id;
      if (newId) {
        navigate(`/projects/${newId}`);
      } else {
        navigate('/projects');
      }
    } catch (error: any) {
      const message = error?.info?.message || error?.message || 'Failed to create project';
      setServerError(message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold">Create New Project</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
                {serverError}
              </div>
            )}
            {serverSuccess && (
              <div className="rounded-md border border-green-200 bg-green-50 text-green-700 px-4 py-2 text-sm">
                {serverSuccess}
              </div>
            )}
            <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project..."
                  {...register("description")}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              errors.startDate ? "border-red-500" : ""
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM dd, yyyy")
                            ) : (
                              <span>Select start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              if (date && watch("endDate") && date > watch("endDate")) {
                                setValue("endDate", undefined as unknown as Date);
                              }
                            }}
                             disabled={(date: Date) => date < startOfToday}
                             fromDate={startOfToday}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              errors.endDate ? "border-red-500" : "",
                              !startDate && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!startDate}
                          >
                            {field.value ? (
                              format(field.value, "MMM dd, yyyy")
                            ) : (
                              <span>Select end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date: Date) => (startDate ? date < (startDate as Date) : false)}
                                className="rounded-md border"
                              />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Required Skills</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            <span className="truncate">
                              {selectedSkills.length > 0
                                ? selectedSkills.join(", ")
                                : "Select skills..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search skills..." />
                            <CommandEmpty>No skills found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {availableSkills.map((skill) => (
                                <CommandItem
                                  key={skill}
                                  value={skill}
                                  onSelect={() => {
                                    const currentValue = field.value || [];
                                    if (currentValue.includes(skill)) {
                                      field.onChange(
                                        currentValue.filter((s: string) => s !== skill)
                                      );
                                    } else {
                                      field.onChange([...currentValue, skill]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSkills.includes(skill)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {skill}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-3 py-1 text-sm"
                            >
                              {skill}
                              <button
                                type="button"
                                  onClick={() => {
                                    field.onChange(
                                      selectedSkills.filter((s: string | undefined) => s !== skill)
                                    );
                                  }}
                                className="ml-2 rounded-full hover:bg-accent"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <Label htmlFor="teamMembers" className="text-sm font-medium">
                  Team Members Needed
                </Label>
                <Input
                  type="number"
                  id="teamMembers"
                  placeholder="Enter number of team members"
                  min="1"
                  {...register("teamMembers", { valueAsNumber: true })}
                  className={errors.teamMembers ? "border-red-500" : ""}
                />
                {errors.teamMembers && (
                  <p className="text-sm text-red-500 mt-1">{errors.teamMembers.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"></span>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}