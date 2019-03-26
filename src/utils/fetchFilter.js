class U_Fetch {
    constructor (url, params, options = {}) {
        this.url = url;
        this.params = params;
        this.options = {
            method: options.method || 'GET',
            mode: options.mode || 'cors', // 避免cors攻击
            credentials: options.credentials || 'include',
            headers: options.headers || { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' }
        };
        this.response = null;
        this.data = null;
        this.preFetch();
    }
    preFetch = () => {
        this.params._ajax = true;
        if (this.options.method.toUpperCase() === 'GET') {
            let paramsArray = [];
            Object.keys(this.params).forEach(key => paramsArray.push(key + '=' + this.params[key]));
            if (this.url.search(/\?/) === -1) {
                this.url += '?' + paramsArray.join('&');
            } else {
                this.url += '&' + paramsArray.join('&');
            }
        } else {
            this.options.body = JSON.stringify(this.params);
            console.log(this.options.body);
        }
    }
    queryFetch = async () => {
        this.response = await fetch(this.url, this.options);
    }
    filterFetch = async () => {
        if (!(this.response.status >= 200 && this.response.status < 300)) {
            throw new Error(this.response.status);
        }
        this.data = await this.response.json();
        if (this.data.code === 3002) {
            window.location.href = this.data.redirect;
        }
    }
}
export default U_Fetch;
