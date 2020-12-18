import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from '../../pages/style.module.css';
import path from 'path';
import Editor from '@monaco-editor/react';

function PlaintextEditor({ file, write }) {
  console.log(file, write);
  const str = 'In text mode';
  const [value, setValue] = useState('');
  function Previewer() {
    
  const [value, setValue] = useState('');
    useEffect(() => {
      (async () => {
        setValue(await file.text());
      })();
    }, [file]);
    return value;
  }

  Previewer.propTypes = {
    file: PropTypes.object
  };

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>
        <Editor
          value={Previewer()}
          language="text"
          height="90vh"
        />
      </div>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
