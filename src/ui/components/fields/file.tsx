
/*
 * Module dependencies.
 */

import { HTMLFieldProps, connectField } from 'uniforms';
import { units } from 'src/ui/styles/dimensions';
import { useDropzone } from 'react-dropzone';
import React from 'react';
import styled from 'styled-components';

/*
 * Styles.
 */

const Dropzone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${units(2)}px;
  background-color: #f5f5f5;
  border: 2px dashed #e0e0e0;
  cursor: pointer;
  margin-bottom: ${units(2)}px;
`;

/*
 * File field component.
 */

type FileProps = HTMLFieldProps<File, HTMLDivElement> & { onFileAdded: (file: File) => void };

function FileField({ onChange, onFileAdded, value }: FileProps) {
  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      'text/html': ['.html', '.htm'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: files => {
      onChange(files[0]);
      onFileAdded(files[0]);
    }
  });

  return (
    <div>
      <Dropzone
        {...getRootProps()}
      >
        {value instanceof File ? value.name : 'Drop file here'}

        <input {...getInputProps()} />
      </Dropzone>
    </div>
  );
}

export default connectField(FileField);
