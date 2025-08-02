"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  console.info("You clicked a breadcrumb.");
}

interface BreadcrumbRoutes {
  title: string;
  route: string;
  currentPage: boolean;
  disabled: any;
}

interface BreadcrumbsProps {
  routes: BreadcrumbRoutes[];
  setOpen?: any;
}

const BasicBreadcrumbs: React.FC<BreadcrumbsProps> = ({ routes, setOpen }) => {

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {routes.map((item: any, index: any) =>
          item.currentPage ? (
            <Typography
              key={index}
              className="dubai-bold primary-color"
              style={{
                fontSize: "18px",
              }}
            >
              {item.title}
            </Typography>
          ) : item.disabled ? (
            <Typography
              key={index}
              className="dubai-med"
              onClick={() => {
                setOpen(true);
              }}
              style={{
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {item.title}
            </Typography>
          ) : (
            <Link
              underline="none"
              color="inherit"
              href={item.route}
              key={index}
              className="dubai-med"
              style={{
                fontSize: "18px",
              }}
            >
              {item.title}
            </Link>
          )
        )}
      </Breadcrumbs>
    </div>
  );
}

export default BasicBreadcrumbs;
