"use strict";

import { ControllerRenderProps } from "react-hook-form";
import { createJobSource, createLocation } from "@/actions/job.actions";
import { addCompany } from "@/actions/company.actions";
import { createJobTitle } from "@/actions/jobtitle.actions";
import { toast } from "./ui/use-toast";
import { createActivityType } from "@/actions/activity.actions";

export async function handleCreateOption(
  fieldName: string,
  label: string,
  field: ControllerRenderProps<any, any>
) {
  let response;
  switch (fieldName) {
    case "company":
      const res = await addCompany({ company: label, logoUrl: "" });
      response = res.data;
      break;
    case "title":
      response = await createJobTitle(label);
      break;
    case "location":
      const locationRes = await createLocation(label);
      if (!locationRes.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: locationRes.message || "Failed to create location",
        });
        return null;
      }
      response = locationRes.data;
      break;
    case "source":
      const source = await createJobSource(label);
      if (!source.success || !source.data) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "message" in source ? source.message : "Unable to create job source.",
        });
        return null;
      }
      response = source.data;
      break;
    case "activityType":
      response = await createActivityType(label);
      break;
    default:
      return null;
  }

  if (!response || !response.id) {
    toast({
      variant: "destructive",
      title: "Error!",
      description: "Failed to create item. Please try again.",
    });
    return null;
  }

  return response;
}

