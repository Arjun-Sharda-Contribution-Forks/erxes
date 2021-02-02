import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import { FlexItem } from 'modules/common/components/step/styles';
import Toggle from 'modules/common/components/Toggle';
import { __ } from 'modules/common/utils';
import { IField } from 'modules/settings/properties/types';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select-plus';
import {
  FlexRow,
  LeftSection,
  Preview,
  PreviewSection,
  ShowPreview
} from '../styles';
import FieldPreview from './FieldPreview';

type Props = {
  onSubmit: (field: IField) => void;
  onDelete: (field: IField) => void;
  onCancel: () => void;
  mode: 'create' | 'update';
  field: IField;
  customProperties?: IField[];
};

type State = {
  field: IField;
  properties?: [{ label: string; value: string }];
  selectedProperty?: { label: string; value: string };
};

class FieldForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      field: props.field,
    }
  }

  onFieldChange = (name: string, value: string | boolean | string[]) => {
    this.setFieldAttrChanges(name, value);
  };

  onSelectChange = (option) => {
    const { customProperties } = this.props;

    if (customProperties) {

      this.setState({ selectedProperty: option })

      const { field } = this.state;

      const customProperty = customProperties.find(e => e._id === option.value);

      if(customProperty) {
        field.associatedFieldId = customProperty._id;
        field.validation = customProperty.validation;
        field.options = customProperty.options;
      }
      
      this.setState({ field })
    }
  }

  onSubmit = e => {
    e.persist();

    const { field } = this.state;
    const { onSubmit } = this.props;

    onSubmit(field);
  };

  setFieldAttrChanges(
    attributeName: string,
    value: string | boolean | string[]
  ) {
    const { field } = this.state;

    field[attributeName] = value;

    this.setState({ field });
  }

  renderValidation() {
    const { field } = this.state;

    if (field.type === 'file') {
      return null;
    }

    const validation = e =>
      this.onFieldChange(
        'validation',
        (e.currentTarget as HTMLInputElement).value
      );

    return (
      <FormGroup>
        <ControlLabel htmlFor="validation">Validation:</ControlLabel>

        <FormControl
          id="validation"
          componentClass="select"
          value={field.validation || ''}
          onChange={validation}
        >
          <option />
          <option value="email">{__('Email')}</option>
          <option value="number">{__('Number')}</option>
          <option value="datetime">{__('Date Time')}</option>
          <option value="date">{__('Date')}</option>
          <option value="phone">{__('Phone')}</option>
        </FormControl>
      </FormGroup>
    );
  }

  renderOptions() {
    const { field } = this.state;

    const onChange = e =>
      this.onFieldChange(
        'options',
        (e.currentTarget as HTMLInputElement).value.split('\n')
      );

    if (!['select', 'check', 'radio'].includes(field.type)) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="type">Options:</ControlLabel>

        <FormControl
          id="options"
          componentClass="textarea"
          value={(field.options || []).join('\n')}
          onChange={onChange}
        />
      </FormGroup>
    );
  }

  renderExtraButton() {
    const { mode, field } = this.props;

    if (mode === 'create') {
      return null;
    }

    const onDelete = e => {
      e.preventDefault();

      this.props.onDelete(field);
    };

    return (
      <Button size="small" btnStyle="danger" onClick={onDelete} icon="cancel-1">
        Delete
      </Button>
    );
  }

  renderLeftContent() {
    const { mode, onCancel, customProperties } = this.props;
    const { field  } = this.state;
    let { selectedProperty } = this.state;

    if (field.associatedFieldId && customProperties) {
      const property = customProperties.find(e => e._id === field.associatedFieldId)
      if (property) {
        selectedProperty = { label: property.text || "", value: property._id }
      }
    }

    let options;

    if(customProperties){
      const filtered = customProperties.filter(e => e.text !== undefined && e.type === field.type);

      options = filtered.map(e => {
        return { value: e._id, label: e.text };
      })
    }

    const text = e =>
      this.onFieldChange('text', (e.currentTarget as HTMLInputElement).value);

    const desc = e =>
      this.onFieldChange(
        'description',
        (e.currentTarget as HTMLInputElement).value
      );

    const toggle = e =>
      this.onFieldChange(
        'isRequired',
        (e.currentTarget as HTMLInputElement).checked
      );

    return (
      <>
        {this.renderValidation()}

        <FormGroup>
          <ControlLabel htmlFor="text" required={true}>
            Field Title
          </ControlLabel>

          <FormControl
            id="FieldLabel"
            type="text"
            value={field.text || ''}
            onChange={text}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="description">Field description</ControlLabel>
          <FormControl
            id="FieldDescription"
            componentClass="textarea"
            value={field.description || ''}
            onChange={desc}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="description">Custom property</ControlLabel>
          <p>{__('Any data collected through this field will copy to:')}</p>
          <Select
            placeholder='Type to search'
            options={options}
            value={selectedProperty}
            onSelectResetsInput={true}
            onBlurResetsInput={false}
            onChange={this.onSelectChange}
          />
        </FormGroup>

        {this.renderOptions()}

        <FlexRow>
          <label>{__('This field is required')}</label>
          <Toggle
            defaultChecked={field.isRequired || false}
            icons={{
              checked: <span>Yes</span>,
              unchecked: <span>No</span>
            }}
            onChange={toggle}
          />
        </FlexRow>

        <Modal.Footer>
          <Button
            btnStyle="simple"
            uppercase={false}
            type="button"
            icon="times-circle"
            onClick={onCancel}
          >
            Cancel
          </Button>

          {this.renderExtraButton()}

          <Button
            uppercase={false}
            onClick={this.onSubmit}
            btnStyle="success"
            icon={mode === 'update' ? 'check-circle' : 'plus-circle'}
          >
            {mode === 'update' ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </>
    );
  }

  renderContent() {
    const { field } = this.state;

    return (
      <FlexItem>
        <LeftSection>{this.renderLeftContent()}</LeftSection>

        <PreviewSection>
          <Preview>
            <FieldPreview field={field} />

            <ShowPreview>
              <Icon icon="eye" /> Field preview
            </ShowPreview>
          </Preview>
        </PreviewSection>
      </FlexItem>
    );
  }

  render() {
    const { mode, field, onCancel } = this.props;

    return (
      <Modal show={true} size="lg" onHide={onCancel} animation={false}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {mode === 'create' ? 'Add' : 'Edit'} {field.type} field
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="ModalBody">{this.renderContent()}</Modal.Body>
      </Modal>
    );
  }
}

export default FieldForm;
