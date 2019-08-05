export class ScriptLoader {
  static load(options, onLoad, onError) {
    const id = options.id || options.url;

    if (!document.getElementById(id)) {
      return new Promise((resolve, reject) => {
        if (!options.url) {
          throw new Error('A url is required to load a script');
        }
        const script = document.createElement('script');
        const parent = options.parent || 'head';
        script.id = id;
        script.src = options.url;
        script.onload = () => {
          if (onLoad) {
            onLoad();
          }
          return resolve(script.id);
        };
        script.onerror = error => {
          if (onError) {
            onError();
          }
          reject(new URIError(`The script ${error.target.src} didn't load correctly.`));
        };
        document[parent].appendChild(script);
      });
    }
    return Promise.resolve('script already loaded in page');
  }
}
