# Image Regression Testing
This project documents a setup for image regression tests that can be used locally or via a CI (Github Actions).

Using the `.imageTests` directory, images can be created via the `JSON` files. A `JSON` file can be used to generate multiple images, or just a single image. Sub-directories can also be used to nest image test cases.

To generate the images, run the following command:
```
make images-generate
```

---

## Workflow - Adding a new Test Case:
Images committed to the `reference` directories in the `.imageTests` folder are considered the source of truth. It is these images we want to compare any newly generated imagaes agaisnt.

- create a new test case image by adding a new directory with a `JSON` file, or adding a new array element to an existing `JSON` file.
- Run `make images-generate` to generate the test case (be sure other test cases aren't being modified).
- Commit the new images and push to Github.


In the CI (Github Actions), the `make images-compare` command will be run. This command will generate the images to a `current`, and then compare each image against it's reference iamge. If an image is not the same, the CI will fail.

<b>Note:</b>
If a new test case is added to the `.imageTests` directory, either via a new element being added to a `JSON` file or an entirely new test case being added, the images will need to be generated using the `make images-generate` command.

If this is not done, the CI will fail because this image will will not be able to be compared in the CI.

---

For Storybook regression testing see the following repository:
[storybook-image-ci-example](https://github.com/joepk90/storybook-image-ci-example)