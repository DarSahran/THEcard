from playwright.sync_api import sync_playwright
import re
import json
import multiprocessing

def scrape_page(url, nextselector, data_queue):
    """Each process starts its own Playwright instance"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        n = 0
        extracted_data = []

        while True:
            n += 1
            print(f"Scraping page {n}")

            html = page.content()
            pattern = r'<div class="mx-auto rounded-xl shadow-md overflow-hidden w-full group hover:shadow-lg bg-white dark:bg-dark dark:shadow-xl dark:hover:shadow-2xl">.*?>.*?</div></div></div></div></div></div>'
            matches = re.findall(pattern, html)

            for item in matches:
                extracted_item = {}
                title = re.findall(r'<h2 class="mt-3.*?>(.*?)</h2>', item)
                spans = re.findall(r'<span>(.*?)</span>', item, re.DOTALL)
                
                if title:
                    extracted_item["title"] = title[0]
                
                for i, span in enumerate(spans):
                    extracted_item[f"key_{i}"] = span
                
                extracted_data.append(extracted_item)

            data_queue.put(extracted_data)

            next_button = page.query_selector(nextselector)
            if next_button:
                next_button.click()
            else:
                print("No more pages")
                break

        browser.close()

def start_scraping():
    url = "https://www.myscheme.gov.in/search"
    nextselector = "#__next > div > main > div.grid.grid-cols-4.gap-4.container.mx-auto.relative.px-4 > div.sm\:col-span-3.col-span-4.items-center.justify-center > div.mt-2 > div.w-full.overflow\:hidden > div > ul > svg.ml-2.text-darkblue-900.dark\:text-white.cursor-pointer"
    
    data_queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=scrape_page, args=(url, nextselector, data_queue))
    process.start()
    process.join()

    # Collect results
    data = []
    while not data_queue.empty():
        data.extend(data_queue.get())

    with open("data.json", "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print("Done")

if __name__ == "__main__":
    start_scraping()