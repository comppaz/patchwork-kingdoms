module.exports = {
    images: {
        domains: ['patchwork-kingdoms.fra1.digitaloceanspaces.com', 'storage.googleapis.com', 'placeholder.com', 'api.lorem.space'],
    },
    webpack: config => {
        config.module.rules.push({
            test: /\.html$/i,
            loader: 'html-loader',
        });
        return config;
    },
};
