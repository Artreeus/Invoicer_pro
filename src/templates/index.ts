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
import StripeTemplate from './StripeTemplate';
import AuroraTemplate from './AuroraTemplate';
import OnyxTemplate from './OnyxTemplate';
import SlateTemplate from './SlateTemplate';
import VibrantTemplate from './VibrantTemplate';

export const templateRegistry: Record<string, ComponentType<TemplateProps>> = {
  stripe: StripeTemplate,
  aurora: AuroraTemplate,
  onyx: OnyxTemplate,
  slate: SlateTemplate,
  vibrant: VibrantTemplate,
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
