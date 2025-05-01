import React from "react";
import { ChildProps } from "@/types";

function PageLayout({ children }: ChildProps) {
  return (
  <div>
    {children}
  </div>  
  )  
}

export default PageLayout;