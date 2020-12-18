import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';

// Used below, these need to be registered
import Editor from '@monaco-editor/react';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
//Changed from Editor to types
const REGISTERED_EDITORS = {
  'text/plain': 'plain',
  'text/markdown': 'markdown',
  'text/javascript': 'javascript',
  'application/json': 'json'
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  const write = file => {
    console.log('Writing soon... ', file.name);

    // TODO: Write the file to the `files` array
  };

  const editorRef = useRef();
  const Type = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  //Creating and using monaco editor
  function GetEdit({ file, write }) {
    const [value, setValue] = useState('');
    useEffect(() => {
      if (file) {
        (async () => {
          setValue(await file.text());
        })();
      }
    }, [file]);

    return (
      <div className={css.preview}>
        <div className={css.title}>
          {path.basename(file.name)}
          <button className={css.button} type="submit" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className={css.content}>
          <Editor
            value={value}
            language={Type}
            height="90vh"
            editorDidMount={handleEditorDidMount}
          />
        </div>
      </div>
    );
  }

  GetEdit.propTypes = {
    file: PropTypes.object,
    write: PropTypes.func
  };

  //Saving Editor changes to file array
  function handleSave() {
    if (activeFile) {
      const tempfile = new File(
        [editorRef.current.getValue()],
        activeFile.name,
        {
          type: activeFile.type,
          lastModified: new Date()
        }
      );
      const newfiles = files;
      newfiles[newfiles.findIndex(obj => obj.name === activeFile.name)] = tempfile;
      setFiles(newfiles);
      setActiveFile(tempfile);
    }
  }

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Type && <GetEdit file={activeFile} write={write} />}
            {!Type && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
