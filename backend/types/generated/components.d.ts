import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsDropdownLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_dropdown_links';
  info: {
    displayName: 'dropdownLink';
  };
  attributes: {
    label: Schema.Attribute.String;
    link: Schema.Attribute.String;
  };
}

export interface ElementsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_stat_items';
  info: {
    displayName: 'StatItem';
  };
  attributes: {
    label: Schema.Attribute.String;
    sub: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ElementsValueItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_value_items';
  info: {
    displayName: 'ValueItem';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.dropdown-link': ElementsDropdownLink;
      'elements.stat-item': ElementsStatItem;
      'elements.value-item': ElementsValueItem;
    }
  }
}
