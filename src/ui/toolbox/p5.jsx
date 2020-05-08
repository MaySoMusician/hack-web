import React from 'react';
import {
  Code,
} from '@material-ui/icons';
import DynToolbox from './dynamic';

function regenerateCode(params) {
  if (!params.code) {
    return '';
  }

  return params.code;
}

function compileCode(code) {
  if (code.trim() === '') {
    return null;
  }

  return { code };
}

const TOOLBOX = {
  tabs: [
    {
      name: 'Code',
      key: 'p5-code',
      icon: <Code />,
      grid: [
        {
          title: 'Code',
          key: 'p5-code',
          type: 'code',
          xs: 12,
          code: regenerateCode,
          compile: compileCode,
          mode: 'javascript',
          buildDelay: 1000,
          fullHeight: true,
        },
      ],
    },
  ],
};

const Toolbox = () => (
  <DynToolbox key="p5" toolbox={TOOLBOX} xs={12} />
);

export default Toolbox;
