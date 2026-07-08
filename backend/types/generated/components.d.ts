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

export interface ElementsHighlightCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_highlight_cards';
  info: {
    displayName: 'Highlight Card';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_elements_stats';
  info: {
    displayName: 'Stat';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
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
      'elements.highlight-card': ElementsHighlightCard;
      'elements.stat': ElementsStat;
      'elements.stat-item': ElementsStatItem;
      'elements.value-item': ElementsValueItem;
    }
  }
}
