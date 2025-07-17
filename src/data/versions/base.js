class BaseVersion {
  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.colors = params.colors;
    this.patterns = params.patterns;
  }

  generateGiveCommand(_banner, _selector) {}

  generateSetBlockCommand(_banner) {}

  fromEncoding(str) {
    const colorCode = str[0];
    const patternCode = str[1];
    const color = this.colors.find((color) => color.encode == colorCode);
    const pattern = this.patterns.find((pattern) => pattern.encode == patternCode);

    return { color: color, pattern: pattern };
  }

  parse(str) {
    const params = str.match(/.{1,2}/g);
    if (!params) {
      return;
    }
    return params.map((code) => {
      return this.fromEncoding(code);
    });
  }

  validate(str) {
    const params = str.match(/.{1,2}/g);
    if (!params) {
      return false;
    }

    let valid = true;
    let firstLoop = true;

    params.map((code) => {
      const colorCode = code[0];
      const patternCode = code[1];

      if (!this.colors.find((color) => color.encode == colorCode)) {
        valid = false;
      }

      // Ignore pattern "a" in first section
      if (firstLoop) {
        firstLoop = false;

        if (patternCode == "a") {
          return;
        }
      }
      if (!this.patterns.find((pattern) => pattern.encode == patternCode)) {
        valid = false;
      }
    });

    return valid;
  }
}

export default BaseVersion;