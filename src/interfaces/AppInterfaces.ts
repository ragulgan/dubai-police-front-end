
export interface Attachment {
  documentSection: string;
  extension: string;
  fileID: number;
  fileName: string;
  filePath: string;
  fileSize: string;
  moduleID: string;
  moduleName: string;
  description: string;
}

export interface EventItem {
  title: string;
  start: string;
  end: string;
  section: string;
  backgroundColor: string;
  textColor: string;
  display: string;
  [key: string]: any;
};

export interface SectionMapping {
  [key: string]: {
    titleKey: string;
    startDateKey: string;
    endDateKey: string;
    idKey: string;
  };
}

export interface ID {
  section: string;
  [key: string]: any;
}


export type Sport = {
  sportID: number;
  sportName: string;
  categoryType: string;
};

export type EventType = "event" | "meeting" | "reminder" | "tournament" | "training";

export interface BreadcrumbRoutes {
  title: string;
  route: string;
  currentPage: boolean;
  disabled: any
}
