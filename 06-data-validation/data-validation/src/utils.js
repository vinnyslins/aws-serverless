const decoratorValidator = (fn, schema, argType) => {
  return async function (event) {
    const body = JSON.parse(event[argType]);
    const { error, value } = await schema.validate(body, { abortEarly: false });

    event[argType] = value;

    if (!error) return fn.apply(this, arguments);

    return {
      statusCode: 422,
      body: error.message,
    };
  };
};

module.exports = {
  decoratorValidator,
};
