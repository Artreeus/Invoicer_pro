import type { ComponentType } from 'react';
import type { TemplateProps } from './shared';
import CorporateTemplate from './CorporateTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ClassicTemplate from './ClassicTemplate';
import RetailTemplate from './RetailTemplate';
import ServiceTemplate from './ServiceTemplate';
import LogisticsTemplate from './LogisticsTemplate';
import FreelancerTemplate from './FreelancerTemplate';
import CreativeTemplate from './CreativeTemplate';
import FormalTemplate from './FormalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import ElegantTemplate from './ElegantTemplate';
import BoldTemplate from './BoldTemplate';

export const templateRegistry: Record<string, ComponentType<TemplateProps>> = {
  corporate: CorporateTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  retail: RetailTemplate,
  service: ServiceTemplate,
  logistics: LogisticsTemplate,
  freelancer: FreelancerTemplate,
  creative: CreativeTemplate,
  formal: FormalTemplate,
  executive: ExecutiveTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
};

export function getTemplate(id: string): ComponentType<TemplateProps> {
  return templateRegistry[id] ?? CorporateTemplate;
}
