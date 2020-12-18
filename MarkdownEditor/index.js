import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from '../pages/style.module.css'
import Editor from '@monaco-editor/react'
import path from 'path';

function MarkdownEditor({ file, write }) {
  console.log(file, write);
  
  function Previewer() {
    const [value, setValue] = useState('');
  
    useEffect(() => {
      (async () => {
        setValue(await file.text());
      })();
    }, [file]);
    return value;
  }
  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>
        <Editor
          value={Previewer()}
          language="markdown"
          height="90vh"
        />
      </div>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
