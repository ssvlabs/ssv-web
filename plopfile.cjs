const Templates = {
  FC: 'Component',
  Modal: 'Modal',
  ForwardRef: 'ComponentWithForwardRef'
};

const getPrompts = (template) => {
  return [
    {
      // Raw text input
      type: 'input',
      // Variable name for this input
      name: 'name',
      // Prompt to display on command line
      message: "What's your components name?"
    },
    {
      // Raw text input
      type: 'input',
      // Variable name for this input
      name: 'path',
      // Prompt to display on command line
      message: 'Which folder?',
      default: 'src/app/atomicComponents/'
      // choices: uiComponents,
    },
    {
      // Raw text input
      type: 'input',
      // Variable name for this input
      name: 'componentType',
      // Prompt to display on command line
      message: 'Which HTML Tag would you like to use?',
      default: 'div'
      // choices: uiComponents,
    },
    {
      type: 'confirm',
      name: 'addProps',
      message: 'Do you want to add custom component props?',
      description: '(type CmpProps = { someProp: string })',
      default: true
    },
    {
      // Raw text input
      type: 'confirm',
      // Variable name for this input
      name: 'wantFolder',
      // Prompt to display on command line
      message: 'Should it be in a folder of its own?',
      default: false
      // choices: uiComponents,
    }
  ];
};

const getActions = (template) => (data) => {
  const name = '/{{pascalCase name}}';
  const path = `{{path}}${name.repeat(data.wantFolder + 1)}.tsx`;

  return [
    {
      // Add a new file
      type: 'add',
      // Path for the new file
      path: path,
      // Handlebars template used to generate content of new file
      templateFile: `plop-templates/${template}.hbs`
    }
  ];
};

module.exports = (plop) => {
  plop.setGenerator('cmp', {
    description: 'Create a component',
    prompts: getPrompts(Templates.FC),
    actions: getActions(Templates.FC)
  });
  plop.setGenerator('modal', {
    description: 'Create a Modal component',
    prompts: getPrompts(Templates.Modal),
    actions: getActions(Templates.Modal)
  });
  plop.setGenerator('cmp-forward-ref', {
    description: 'Create a component forwardRef',
    prompts: getPrompts(Templates.ForwardRef),
    actions: getActions(Templates.ForwardRef)
  });
};
