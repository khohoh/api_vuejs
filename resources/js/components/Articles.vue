<template>
  <div>
      <h2>Articles</h2>
        <form @submit.prevent="addArticle" class="mb-5">
            <div class="form-group mb-3">
                <input type="text" class="form-control" placeholder="Title" v-model="article.title">
            </div>
            <div class="form-group mb-3">
                <textarea class="form-control" placeholder="body" v-model="article.body"></textarea>
            </div>
            <button type="submit" class="btn btn-success btn-block">Save</button>
        </form>

        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li :class="[{disabled: !pagination.prev_page_url}]" class="page-item">
                    <a class="page-link" href="#" @click="fetchArticles(pagination.prev_page_url)">Previous</a>
                </li>

                <li class="page-item disabled">
                    <a class="page-link text-dark" href="#">{{ pagination.current_page }} of {{ pagination.last_page }}</a>
                </li>
                
                <li :class="[{disabled: !pagination.next_page_url}]" class="page-item">
                    <a class="page-link" href="#" @click="fetchArticles(pagination.next_page_url)">Next</a>
                </li>
            </ul>
        </nav>

      <div class="card card-body mb-2" v-for="article in articles" :key="article.id">
          <h3>{{ article.title }}</h3>
          <p>{{ article.body }}</p>
          <hr>
          <button @click="editArticle(article)" class="btn btn-warning mb-2">Edit</button>
          <button @click="deleteArticle(article.id)" class="btn btn-danger">Delete</button>          
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            articles: [],
            article: {
                id: '',
                title: '',
                body: '',
            },
            article_id: '',
            pagination: {},
            edit: false
        }
    },

    methods: {
        makePagination(meta, links) {
            let pagination = {
                current_page: meta.current_page,
                last_page: meta.last_page,
                next_page_url: links.next,
                prev_page_url: links.prev,
            }

            this.pagination = pagination;
        },

        fetchArticles(page_url) {
            let vm = this;
            page_url = page_url || '/api/articles'
            fetch(page_url)
            .then(res => res.json())
            .then(res => {
                this.articles = res.data;
                vm.makePagination(res.meta, res.links);
            })
            .catch(err => console.log(err));
        },

        deleteArticle(id) {
            if (confirm('Are you sure?')) {
                fetch(`/api/article/${id}`, { method: 'delete' })
                .then(res => res.json())
                .then(data => {
                    alert('Article Removed');
                    this.fetchArticles();
                })
                .catch(err => console.log(err));
            }
        },

        addArticle() {            
            if (this.edit === false) {                
             fetch('/api/article', {
                 method: 'post',                 
                 headers: {
                     'Content-type' : 'application/json'
                 },
                 body: JSON.stringify(this.article),
             })             
               /*  axios.post('/api/article', {
                    article: JSON.stringify(this.article)
                })  */            
             .then(res => res.json())
             .then(data => {
                 this.article.title = "";
                 this.article.body = "";
                 alert('Article Added');
                 this.fetchArticles();
             })
             .catch(err => console.log(err));
            } 
            else {
                fetch('/api/article', {
                 method: 'put',                 
                 headers: {
                     'Content-type' : 'application/json'
                 },
                 body: JSON.stringify(this.article),
             })                      
             .then(res => res.json())
             .then(data => {
                 this.article.title = "";
                 this.article.body = "";
                 alert('Article Updated');
                 this.fetchArticles();
             })
             .catch(err => console.log(err));
            }
        },

        editArticle(article) {
            this.edit = true;
            this.article.id = article.id;
            this.article.article_id = article.id;
            this.article.title = article.title;
            this.article.body = article.body;
        },
    },

    created() {
        this.fetchArticles();
    }
}
</script>

<style>

</style>