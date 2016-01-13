import {execSync} from "child_process";
import gulp from "gulp";
import eslint from "gulp-eslint";
import lambdaDeploy from "lambda-deploy";

gulp.task("deploy", function () {
    return lambdaDeploy();
});

gulp.task("test", function () {
    const bin = "./node_modules/.bin";
    // a mongod instance and an env.MONGODB_URL param are needed
    execSync(`${bin}/babel-node ${bin}/isparta cover ${bin}/_mocha -- --recursive`, {
        env: {
            ...process.env,
            NODE_ENV: "test",
            NODE_PATH: "./src/"
        },
        stdio: [null, process.stdout]
    });
});

gulp.task("lint", function () {
    return gulp.src(["src/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("default", ["test", "lint"], function () {
    return gulp.watch(["src/**/*.js", "test/**/*.js"], ["test", "lint"]);
});
