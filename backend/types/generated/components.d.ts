import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsContentBlock extends Struct.ComponentSchema {
  collectionName: 'components_elements_content_blocks';
  info: {
    displayName: 'ContentBlock';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right', 'center']>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

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

export interface ElementsLeader extends Struct.ComponentSchema {
  collectionName: 'components_elements_leaders';
  info: {
    displayName: 'leader';
  };
  attributes: {
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsOffice extends Struct.ComponentSchema {
  collectionName: 'components_elements_offices';
  info: {
    displayName: 'office';
  };
  attributes: {
    address: Schema.Attribute.Text;
    city: Schema.Attribute.String;
    lat: Schema.Attribute.Decimal;
    lng: Schema.Attribute.Decimal;
    mapQuery: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface ElementsPolicySection extends Struct.ComponentSchema {
  collectionName: 'components_elements_policy_sections';
  info: {
    displayName: 'Policy Section';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_elements_stats';
  info: {
    displayName: 'Stat';
  };
  attributes: {
    description: Schema.Attribute.String;
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

export interface SharedContactPerson extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_people';
  info: {
    displayName: 'Contact Person';
  };
  attributes: {
    email: Schema.Attribute.Email;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.content-block': ElementsContentBlock;
      'elements.dropdown-link': ElementsDropdownLink;
      'elements.highlight-card': ElementsHighlightCard;
      'elements.leader': ElementsLeader;
      'elements.office': ElementsOffice;
      'elements.policy-section': ElementsPolicySection;
      'elements.stat': ElementsStat;
      'elements.stat-item': ElementsStatItem;
      'elements.value-item': ElementsValueItem;
      'shared.contact-person': SharedContactPerson;
    }
  }
}
