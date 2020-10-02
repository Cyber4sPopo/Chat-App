const puppeteer = require("puppeteer");
const nock = require("nock");
const useNock = require("nock-puppeteer");

let mockMessages = [
  {
    message: "hello",
    user: "Amir",
  },
  {
    message: "hey",
    user: "Matan",
  },
  {
    message: "bye",
    user: "Amir",
  },
];

let page1, page2;
let browser;

describe("Tests", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
    page1 = await browser.newPage();
    page2 = await browser.newPage();
    useNock(page1, ["http://localhost:3000/"]);
  });
  beforeEach(() => {
    mockMessages = [
        {
          message: "hello",
          user: "Amir",
        },
        {
          message: "hey",
          user: "Matan",
        },
        {
          message: "bye",
          user: "Amir",
        },
      ];
  });
  afterAll(() => {
    browser.close();
  });

  test("if input and button exists", async () => {
    await page1.goto("http://localhost:3000/");

    await page1.waitForSelector("#messageInput", { visible: true });
    await page1.waitForSelector("#sendButton", { visible: true });
  }, 30000);

  test("if client requests messages and displays them on page", async () => {
    const getMessages = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .get("/messages")
      .reply(200, mockMessages);
    await page1.waitForSelector(".msg", { visible: true });
    const messages = await await page1.$$(".msg");
    expect(messages.length).toBe(3);
    expect(getMessages.isDone()).toBe(true);
  }, 30000);

  test("if send button sends post request to server", async () => {
    const sendMessage = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .post("/messages")
      .reply(200);
    await page1.waitForSelector("#messageInput", { visible: true });
    await page1.type("#messageInput", "hello");
    const button = await page1.$("#sendButton");
    button.click();
    await timeout(2000);
    expect(sendMessage.isDone()).toBe(true);
  }, 30000);

  test("if page updates on update of data in server", async () => {
    const getMessages = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .get("/messages")
      .reply(200, mockMessages);
    const sendMessage = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .post("/messages")
      .reply(200);
    await page1.waitForSelector("#messageInput", { visible: true });
    const messages = await page1.$$(".msg");
    expect(messages.length).toBe(3);
    await page1.type("#messageInput", "Test");
    const button = await page1.$("#sendButton");
    mockMessages.push({ message: "Test", user: "Tal" });
    const getMessages2 = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .get("/messages")
      .reply(200, mockMessages);
    button.click();
    await timeout(4000);
    const messagesUpdated = await page1.$$(".msg");
    expect(messagesUpdated.length).toBe(4);
  }, 30000);

  //   test("if send button sends post request to server", async () => {
  //     //page 2
  //     useNock(page2, ["http://localhost:3000/"]);
  //     await page2.goto("http://localhost:3000/");
  //     const getMessages = await nock("http://localhost:3000", {
  //       allowUnmocked: true,
  //     })
  //       .get("/messages")
  //       .reply(200, mockMessages);

  //     await page2.waitForSelector(".msg", { visible: true });
  //     const messages = await page2.$$(".msg");
  //     expect(messages.length).toBe(3);

  //     //page 1
  //     useNock(page1, ["http://localhost:3000/"]);
  //     const sendMessage = await nock("http://localhost:3000", {
  //       allowUnmocked: true,
  //     })
  //       .post("/messages")
  //       .reply(200);

  //     await page1.type("#messageInput", "Test");
  //     const button = await page1.$("#sendButton");
  //     mockMessages.push({message: 'Test2', user: 'Tal'})
  //     button.click();

  //     //page 2
  //     useNock(page2, ["http://localhost:3000/"]);
  //     const getMessagesUpdate = await nock("http://localhost:3000", {
  //       allowUnmocked: true,
  //     })
  //       .get("/messages")
  //       .reply(200, mockMessages);
  //     await timeout(4000);
  //     const messagesUpdated = await page2.$$(".msg");
  //     expect(messagesUpdated.length).toBe(4);
  //   }, 30000);

  test("change user name", async () => {
    const getMessages = await nock("http://localhost:3000", {
        allowUnmocked: true,
      })
        .get("/messages")
        .reply(200, mockMessages);
    const sendMessage = await nock("http://localhost:3000", {
      allowUnmocked: true,
    })
      .post("/messages")
      .reply(200);
    const input = await page1.$("#changeUserInput");
    await input.click({ clickCount: 3 });
    await page1.type("#changeUserInput", "Amir");
    const greenMessages = await page1.$$(".green");
    const redMessages = await page1.$$(".red");
    expect(greenMessages.length).toBe(2);
    expect(redMessages.length).toBe(1);
  }, 30000);
});

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
