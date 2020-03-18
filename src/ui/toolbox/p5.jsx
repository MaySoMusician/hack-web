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
  if (code === '') {
    return null;
  }

  return { code };
}

const TOOLBOX = {
  tabs: [
    {
      name: 'Code',
      icon: <Code />,
      grid: [
        {
          title: 'Code',
          type: 'code',
          xs: 12,
          code: regenerateCode,
          compile: compileCode,
          buildDelay: 0,
        },
      ],
    },
  ],
};

const Toolbox = () => (
  <DynToolbox toolbox={TOOLBOX} />
);

export default Toolbox;